import { FastifyInstance } from 'fastify/types/instance'
import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftTemplateType } from '@service/enums/shiftTemplateType'
import { VirtualMonthAssignment, VirtualShiftTemplate, ExceedWorkHourInfo, WorkingSlot } from '@service/types/validateAssignment.type'
import { buildShiftDateTime } from '@service/helpers/timeHelper'

export const validateWorkHourAssignment = (
    virtualMonthAssignments: VirtualMonthAssignment[],
    virtualShiftTemplate: VirtualShiftTemplate[],
    logger: FastifyInstance['log']
): void => {

    const MAX_CONTINUOUS_HOURS = 16
    const assignmentMap = new Map<string, WorkingSlot[]>()
    const templateMap = new Map(
        virtualShiftTemplate.map(t => [t.shiftTemplateId, t])
    )

    const exceedInfo: ExceedWorkHourInfo[] = []

    // assignment map
    for (const assignment of virtualMonthAssignments) {
        if (!assignment.shiftTemplateId) continue

        const template = templateMap.get(assignment.shiftTemplateId)

        if (!template) continue

        if (!assignmentMap.has(assignment.userId)) {
            assignmentMap.set(assignment.userId, [])
        }

        const { startAt, endAt } = buildShiftDateTime(
            assignment.date,
            template.startTime,
            template.endTime
        )

        assignmentMap.get(assignment.userId)!.push({
            date: assignment.date,
            start: startAt,
            end: endAt,
            durationHours: template.durationHours,
            type: template.type as ShiftTemplateType
        })
    }

    const sortedAssignmentMap = new Map(
        Array.from(assignmentMap.entries()).map(([userId, slots]) => {
            const sortedSlots = slots.sort(
                (a, b) => a.start.getTime() - b.start.getTime()
            )

            return [userId, sortedSlots]
        })
    )

    // ตรวจสอบแต่ละ user
    for (const [userId, slots] of sortedAssignmentMap.entries()) {
        let continuousHours = 0
        let exceedDates: Date[] = []

        for (let i = 0; i < slots.length; i++) {

            if (i === 0) {
                continuousHours = slots[i].durationHours
                continue
            }

            const prev = slots[i - 1]
            const current = slots[i]

            // คำนวณ gap ชั่วโมง
            let gapHours = 0

            if (prev.date.getTime() === current.date.getTime()) {
                // ลง shift ประเภทเดียวกัน (morning, afternoon, night) ในวันเดียวกัน error
                if (prev.type === current.type) {
                    throw throwCustomError(
                        ErrorDescription.CONFLICTING_ASSIGNMENT_EXISTS,
                        StatusCode.BAD_REQUEST_400
                    )
                }
                // วันเดัยวกันหา gap
                gapHours = (current.start.getTime() - prev.end.getTime()) / (1000 * 60 * 60)
            }

            if (gapHours > 0) {
                // มี gap → reset
                continuousHours = current.durationHours
            } else {
                // ต่อเนื่อง → accumulate
                continuousHours += current.durationHours
            }

            if (continuousHours > MAX_CONTINUOUS_HOURS) {
                exceedDates.push(current.date)
            }
        }

        if (exceedDates.length > 0) {
            exceedInfo.push({
                userId,
                dates: exceedDates
            })
        }
    }

    if (exceedInfo.length > 0) {
        logger.error('Users exceed 16 continuous working hours')
        throw throwCustomError(
            ErrorDescription.EXCEED_MAX_CONTINUOUS_WORK_HOUR,
            StatusCode.BAD_REQUEST_400,
            exceedInfo
        )
    }
}