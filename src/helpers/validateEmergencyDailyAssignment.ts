import { throwCustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'
import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'

export const validateEmergencyDailyAssignment = (
    assignments: VirtualMonthAssignment[],
    totalWardMembers: number
): void => {

    const assignmentByDay = new Map<string, VirtualMonthAssignment[]>()

    // group by date
    for (const a of assignments) {
        const key = a.date.toISOString().slice(0, 10)

        if (!assignmentByDay.has(key)) {
            assignmentByDay.set(key, [])
        }

        assignmentByDay.get(key)!.push(a)
    }

    const missingEmergencyDays: number[] = []

    // validate each day
    for (const [date, dayAssignments] of assignmentByDay) {
    
        const uniqueUsers = new Set(dayAssignments.map(a => a.userId))
        // ถ้า assign ครบคนแล้ว
        if (uniqueUsers.size >= totalWardMembers) {

            const hasEmergency = dayAssignments.some(
                a => a.assignmentType === ShiftAssignmentType.EMERGENCY
            )

            if (!hasEmergency) {
                const dayNumber = new Date(date).getDate()

                missingEmergencyDays.push(dayNumber)
            }
        }
    }

    if (missingEmergencyDays.length > 0) {
        const error = ErrorDescription.EMERGENCY_REQUIRED_PER_DAY

        console.error('Emergency validation failed', {
            dates: missingEmergencyDays,
            totalWardMembers
        })

        throw throwCustomError(
            error,
            StatusCode.BAD_REQUEST_400,
            missingEmergencyDays
        )
    }
}