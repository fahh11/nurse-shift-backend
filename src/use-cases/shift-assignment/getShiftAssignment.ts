import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { WardMemberRepository } from '@service/domain/repositories/wardMember.repository'
import { WardMemberRole } from '@service/enums/wardMemberRole'

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
    const allShiftAssignmentRecords = await repos.shiftAssignmentRepo.findByWardIdAndMonth(wardId, month, year)

    const mapShiftAssignments = new Map<
        string,
        {
            userId: string
            name: string
            assignments: {
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

        if (member.role !== WardMemberRole.HEAD_NURSE && !mapShiftAssignments.has(member.userId)) {
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
            shiftTemplateType: shiftTemplateData ? shiftTemplateData.type : null,
            date: record.date.toISOString().split('T')[0],
            assignmentType: record.assignmentType,
        })
    }

    const result = Array.from(mapShiftAssignments.values())
    return result
}