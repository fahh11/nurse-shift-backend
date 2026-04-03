import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'
import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'

export const validateUserAssignmentCoverage = (
    allAssignments: VirtualMonthAssignment[],
    month: number,
    year: number
):void => {
    console.log(allAssignments)

    const userAssignmentMap = new Map<string, Set<number>>()

    for (const assignment of allAssignments) {
        const date = assignment.date
        if (date.getMonth() + 1 !== month || date.getFullYear() !== year) {
            continue
        }

        if (!userAssignmentMap.has(assignment.userId)) {
            userAssignmentMap.set(assignment.userId, new Set())
        }

        userAssignmentMap.get(assignment.userId)!.add(date.getDate())
    }

    console.log(userAssignmentMap)
}