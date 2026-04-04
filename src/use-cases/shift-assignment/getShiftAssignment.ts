import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardRepository } from '@service/domain/repositories/ward.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { WardMemberRole } from '@service/enums/wardMemberRole'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export const getSummaryMonthShiftAssignment = async (
    wardId: string,
    year: number,
    month: number,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardMemberRepo: WardMemberRepository
    }
) => {
    // หา member ทั้งหมดของ ward นี้
    const allMembers = await repos.wardMemberRepo.findByWardId(wardId)
    if (!allMembers) {
        logger.error('Ward member not found')
        throw throwCustomError(
            ErrorDescription.WARD_MEMBER_NOT_FOUND,
            StatusCode.NOT_FOUND_404
        )
    }

    // หา shift assignment ทั้งหมดของ ward ตามช่วงเวลา
    const allShiftAssignmentRecords = await repos.shiftAssignmentRepo.findActiveAssignmentByWardIdAndMonth(wardId, month, year)

    const mapShiftAssignments = new Map<
        string,
        {
            userId: string
            name: string
            assignments: {
                shiftAssignmentId: string | null
                shiftTemplateType: string | null
                date: string
                assignmentType: string
            }[]
        }
    >()

    // นำ member เข้า map
    for (const member of allMembers) {
        const userData = await repos.userRepo.findById(member.userId)
        if (!userData) {
            logger.error('User not found')
            throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
        }

        if (!mapShiftAssignments.has(member.userId)) {
            mapShiftAssignments.set(member.userId,
                {
                    userId: userData.userId,
                    name: `${userData.firstName ?? ''} ${userData.lastName ?? ''}`,
                    assignments: []
                }
             )
        }
    }

    // เอา assignment เข้า map
    for (const record of allShiftAssignmentRecords) {
        // หาก record ถูก delete ไปแล้วให้ข้าม
        if (record.deletedAt) continue

        const memberOfGroup = mapShiftAssignments.get(record.userId)
        if (!memberOfGroup) continue

        let shiftTemplateData = null

        if (record.shiftTemplateId) {
            shiftTemplateData = await repos.shiftTemplateRepo.findById(record.shiftTemplateId)

            if (!shiftTemplateData) {
                logger.error('Shift template not found')
                throw throwCustomError(
                    ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND,
                    StatusCode.NOT_FOUND_404
                )
            }
        }

        // push assignment เข้าไป
        mapShiftAssignments.get(record.userId)!.assignments.push({
            shiftAssignmentId: record.shiftAssignmentId,
            shiftTemplateType: shiftTemplateData ? shiftTemplateData.type : null,
            date: record.date.toISOString().split('T')[0],
            assignmentType: record.assignmentType,
        })
    }

    const result = Array.from(mapShiftAssignments.values())
    return result
}

export const getShiftAssignmentforCreateSwap = async (
    userId: string,
    wardId: string,
    approverUserId: string | undefined,
    year: number,
    month: number,
    day: number | undefined,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
        wardRepo: WardRepository
    }
) => {
    // หา user, approver จาก id
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

    // หา shift assignment ทั้งหมดใน ward นี้
    const allShiftAssignmentRecords = await repos.shiftAssignmentRepo.findActiveAssignmentByWardIdAndMonth(
        wardData.wardId,
        month,
        year
    )

    let filteredAssignments = allShiftAssignmentRecords

    // กรองเอา shift assignment ของ current user ออก
    filteredAssignments = filteredAssignments.filter(
        record => record.userId !== currentUser.userId
    )

    // กรองเอา shift assignment ของ leave ออก
    filteredAssignments = filteredAssignments.filter(
        record => record.assignmentType !== ShiftAssignmentType.LEAVE
    )

    // กรองเฉพาะ approver user เลือก
    if (approverUserId) {
        const approverUser = await repos.userRepo.findById(approverUserId)

        if (!approverUser) {
            logger.error('Approver user not found')
            throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
        }

        filteredAssignments = filteredAssignments.filter(
            record => record.userId === approverUser.userId
        )
    }

    // กรองเฉพาะวันที่เลือก
    if (day) {
        filteredAssignments = filteredAssignments.filter(
            record => record.date.getDate() === day
        )
    }

    // ใส่ record
    const results = [];

    const userCache = new Map<string, any>()
    const templateCache = new Map<string, any>()

    for (const record of filteredAssignments) {

        // const approverUser = await repos.userRepo.findById(record.userId)

        let approverUser = userCache.get(record.userId)

        if (!approverUser) {
            approverUser = await repos.userRepo.findById(record.userId)
            if (!approverUser) {
                throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
            }
            userCache.set(record.userId, approverUser)
        }


        let shiftTemplateData = null

        if (record.shiftTemplateId) {
            shiftTemplateData = templateCache.get(record.shiftTemplateId)
            // shiftTemplateData = await repos.shiftTemplateRepo.findById(record.shiftTemplateId)

            if (!shiftTemplateData) {
                shiftTemplateData = await repos.shiftTemplateRepo.findById(record.shiftTemplateId)

                if (!shiftTemplateData) {
                    logger.error('Shift template not found')
                    throw throwCustomError(ErrorDescription.SHIFT_TEMPLATE_NOT_FOUND, StatusCode.NOT_FOUND_404)
                }
                templateCache.set(record.shiftTemplateId, shiftTemplateData)
            }
        }

        results.push({
            approverShiftAssignmentId: record.shiftAssignmentId,
            approverName: `${approverUser.firstName} ${approverUser.lastName}`,
            shiftAssignmentType: record.assignmentType,
            shiftTemplateType: shiftTemplateData ? shiftTemplateData.type : null,
        })
    }

    return results
}