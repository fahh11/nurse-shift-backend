import { FastifyInstance } from 'fastify'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentRepository } from '@service/domain/repositories/shiftAssignment.repository'
import { ShiftTemplateRepository } from '@service/domain/repositories/shiftTemplate.repository'
import { UserRepository } from '@service/domain/repositories/user.repository'

export const getSummaryMonthShiftAssignment = async (
    wardId: string,
    year: number,
    month: number,
    logger: FastifyInstance['log'],
    repos: {
        shiftAssignmentRepo: ShiftAssignmentRepository
        shiftTemplateRepo: ShiftTemplateRepository
        userRepo: UserRepository
    }
) => {
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


    for (const record of allShiftAssignmentRecords) {
        const userId = record.userId

        const userData = await repos.userRepo.findById(userId)
        if (!userData) {
            logger.error('User not found')
            throw throwCustomError(ErrorDescription.USER_NOT_FOUND, StatusCode.NOT_FOUND_404)
        }

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

        // ถ้ายังไม่มี user นี้ → create group ใหม่
        if (!mapShiftAssignments.has(record.userId)) {
            mapShiftAssignments.set(userId,
                {
                    userId: userData.userId,
                    name: `${userData.firstName ?? ''} ${userData.lastName ?? ''}`,
                    assignments: []
                }
            )
        }

        // push assignment เข้าไป
        mapShiftAssignments.get(userId)!.assignments.push({
            shiftTemplateType: shiftTemplateData ? shiftTemplateData.type : null,
            date: record.date.toISOString().split('T')[0],
            assignmentType: record.assignmentType,
        })
    }

    const result = Array.from(mapShiftAssignments.values())
    return result
}