import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type'
import { CreateShiftAssignmentOutputDto } from '@service/interfaces/dto/shift-assignment/shiftAssignment.output'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { ShiftRequirementRepository } from '@service/domain/repositories/shiftRequirement.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'
import { validateDailyAssignment } from '@service/helpers/validateDailyAssignment'
import { validateWorkHourAssignment } from '@service/helpers/validateWorkHourAssignment'
import { calculateDurationHours } from '@service/helpers/calculateDurationHours'

export const createShiftAssignment = async(
    input: CreateShiftAssignmentBody[],
    wardId: string,
    userId: string,
    year: number,
    month: number,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        shiftRequirementRepo: ShiftRequirementRepository
        userRepo: UserRepository
        wardRepo: WardRepository
        wardMemberRepo: WardMemberRepository
    }
): Promise<CreateShiftAssignmentOutputDto[]> => {
    // ======= Load once =======

    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา ward 
    const wardData = await repos.wardRepo.findById(wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // user ที่ create ต้องเป็น member ของ ward นั้นๆ
    const isCurrentUserMember = await repos.wardMemberRepo.findByUserIdAndWardId(currentUser.userId, wardData.wardId)

    if (!isCurrentUserMember) {
        logger.error('Current user is not the member of this ward')
        throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
    }

    // ดึง month assignment ของเดือนนี้
    const allMonthAssignments = await repos.shiftAssignmentRepo.findByWardIdAndMonth(wardData.wardId, month, year)

    const virtualMonthAssignments = [
        ...allMonthAssignments.map(a => ({
            userId: a.userId,
            wardId: a.wardId,
            date: a.date,
            assignmentType: a.assignmentType,
            shiftTemplateId: a.shiftTemplateId
        })),
        ...input.map(a => ({
            userId: a.userId,
            wardId: wardData.wardId,
            date: new Date(`${a.date}T00:00:00.000Z`),
            assignmentType: a.assignmentType,
            shiftTemplateId: a.shiftTemplateId
        }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime())

    // ดึง shift template shift requirement ที่ active ทั้งหมดใน ward นี้
    const allShiftTemplateInWard = await repos.shiftTemplateRepo.findByWardId(wardData.wardId)

    const virtualAllShiftTemplate = []

    for (const template of allShiftTemplateInWard) {
        const activeShiftRequirement = await repos.shiftRequirementRepo.findActiveByShiftTemplateId(template.shiftTemplateId)

        if (!activeShiftRequirement) {
            logger.error('Active shift requirement not found for shift template id: ' + template.shiftTemplateId)
            throw throwCustomError(
                ErrorDescription.SHIFT_REQUIREMENT_NOT_FOUND,
                StatusCode.NOT_FOUND_404
            )
        }

        virtualAllShiftTemplate.push({
            shiftTemplateId: template.shiftTemplateId,
            wardId: template.wardId,
            type: template.type,
            startTime: template.startTime,
            endTime: template.endTime,
            requiredPeople: activeShiftRequirement.requiredPeople,
            durationHours: calculateDurationHours(template.startTime, template.endTime)
        })
    }

    validateWorkHourAssignment(virtualMonthAssignments, virtualAllShiftTemplate, logger)

    // ======= Process list =======
    const results: CreateShiftAssignmentOutputDto[] = []

    for (const assignment of input) {
        // normalize date
        const normalizeDate = new Date(`${assignment.date}T00:00:00.000Z`)

        // หา user ที่ถูก assign จาก id
        const assignedUserData = await repos.userRepo.findById(assignment.userId)
        if (!assignedUserData) {
            logger.error('User not found')
            throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
        }

        // หาก shift assignment เป็น shift ต้องมี shift template id
        if (assignment.assignmentType ===  ShiftAssignmentType.SHIFT && !assignment.shiftTemplateId) {
            throw throwCustomError(
                ErrorDescription.SHIFT_TEMPLATE_REQUIRED,
                StatusCode.BAD_REQUEST_400
            )
        }
        if (assignment.assignmentType !== ShiftAssignmentType.SHIFT && assignment.shiftTemplateId) {
            throw throwCustomError(
                ErrorDescription.INVALID_SHIFT_TEMPLATE_USAGE,
                StatusCode.BAD_REQUEST_400
            )
        }

        // หา shift template ที่ี user เลือก
        let shiftTemplateData = null

        if (assignment.shiftTemplateId) {
            shiftTemplateData = await repos.shiftTemplateRepo.findById(assignment.shiftTemplateId)

            if (!shiftTemplateData) {
                logger.error('Shift template not found')
                throw throwCustomError(
                    ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND,
                    StatusCode.NOT_FOUND_404
                )
            }
        }

        // user ที่ถูก assign ต้องเป็น member ของ ward นั้นๆ
        const isAssignedUserMember = await repos.wardMemberRepo.findByUserIdAndWardId(assignedUserData.userId, wardData.wardId)

        if (!isAssignedUserMember) {
            logger.error('Assigned user is not the member of this ward')
            throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
        }

        // validateDailyAssignment -> หากในวันนั้น มีการ leave, off, emergency จะลงอย่างอีนไม่ได้อีก
        const existingAssignments = await repos.shiftAssignmentRepo.findByUserIdAndDate(assignedUserData.userId, normalizeDate)
        validateDailyAssignment(existingAssignments, assignment.assignmentType)

        // create shift assignment 
        const newShiftAssignment = new ShiftAssignment({
            shiftTemplateId: shiftTemplateData?.shiftTemplateId ?? null,
            wardId: wardData.wardId,
            userId: assignedUserData.userId,
            date: normalizeDate,
            assignmentType: assignment.assignmentType,
            createdBy: currentUser.userId,
            updatedBy: currentUser.userId,
        })

        const created = await repos.shiftAssignmentRepo.create(newShiftAssignment);

        results.push(created)
    }

    return results
}