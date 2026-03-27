import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type'
import { CreateShiftAssignmentOutputDto } from '@service/interfaces/dto/shift-assignment/shiftAssignment.output'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'


export const createShiftAssignment = async(
    input: CreateShiftAssignmentBody,
    wardId: string,
    userId: string,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
        wardMemberRepo: WardMemberRepository
    }
): Promise<CreateShiftAssignmentOutputDto> => {
    // normalize date
    const normalizeDate = new Date(`${input.date}T00:00:00.000Z`)

    // หา user ปัจจุบันจาก id
    const currentUser = await repos.userRepo.findById(userId)
    if (!currentUser) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หา user ที่ถูก assign จาก id
    const assignedUserData = await repos.userRepo.findById(input.userId)
    if (!assignedUserData) {
        logger.error('User not found')
        throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // หาก shift assignment เป็น shift ต้องมี shift template id
    if (input.assignmentType ===  ShiftAssignmentType.SHIFT && !input.shiftTemplateId) {
        throw throwCustomError(
            ErrorDescription.SHIFT_TEMPLATE_REQUIRED,
            StatusCode.BAD_REQUEST_400
        )
    }
    if (input.assignmentType !== ShiftAssignmentType.SHIFT && input.shiftTemplateId) {
        throw throwCustomError(
            ErrorDescription.INVALID_SHIFT_TEMPLATE_USAGE,
            StatusCode.BAD_REQUEST_400
        )
    }

    // หา shift template ที่ี user เลือก
    let shiftTemplateData = null

    if (input.shiftTemplateId) {
        shiftTemplateData = await repos.shiftTemplateRepo.findById(input.shiftTemplateId)

        if (!shiftTemplateData) {
            logger.error('Shift template not found')
            throw throwCustomError(
                ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND,
                StatusCode.NOT_FOUND_404
            )
        }
    }

    // หา ward 
    const wardData = await repos.wardRepo.findById(wardId)
    if (!wardData) {
        logger.error('Ward not found')
        throw throwCustomError(ErrorDescription.WARD_NOT_FOUND, StatusCode.NOT_FOUND_404)
    }

    // user ที่ถูก assign ต้องเป็นสมาชิกใน ward นั้น
    const memberOfWardData = await repos.wardMemberRepo.findByUserIdAndWardId(currentUser.userId, wardData.wardId)

    if (!memberOfWardData) {
        logger.error('User not the member of this ward')
        throw throwCustomError(ErrorDescription.WARD_ACCESS_DENIED, StatusCode.FORBIDDEN_403)
    }

    // หากในวันนั้น มีการ leave, off, emergency จะลงอย่างอีนไม่ได้อีก
    const existingAssignments = await repos.shiftAssignmentRepo.findByUserIdAndDate(assignedUserData.userId, normalizeDate)
    const hasSpecialAssignment = existingAssignments.some(a => a.assignmentType !== ShiftAssignmentType.SHIFT)

    const hasAnyAssignment = existingAssignments.length > 0

    // ถ้ากำลังจะลง SHIFT
    if (input.assignmentType === ShiftAssignmentType.SHIFT) {
        // แต่วันนั้นมี off/leave/emergency แล้ว
        if (hasSpecialAssignment) {
            throw throwCustomError(
                ErrorDescription.CONFLICTING_ASSIGNMENT_EXISTS,
                StatusCode.BAD_REQUEST_400
            )
        }
    }

    // ถ้ากำลังจะลง OFF / LEAVE / EMERGENCY
    else {
        // วันนั้นต้องว่างเท่านั้น
        if (hasAnyAssignment) {
            throw throwCustomError(
                ErrorDescription.DAY_ALREADY_HAS_ASSIGNMENT,
                StatusCode.BAD_REQUEST_400
            )
        }
    }

    // create shift assignment 
    const newShiftAssignment = new ShiftAssignment({
        shiftTemplateId: shiftTemplateData?.shiftTemplateId ?? null,
        wardId: wardData.wardId,
        userId: assignedUserData.userId,
        date: normalizeDate,
        assignmentType: input.assignmentType,
        createdBy: currentUser.userId,
        updatedBy: currentUser.userId,
    })
    
    const result = await repos.shiftAssignmentRepo.create(newShiftAssignment);
    return result
}