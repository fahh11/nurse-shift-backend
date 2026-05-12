import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'
import { WarningType } from '@service/enums/warningType'

export const validateUserAssignmentCoverage = (
    warning: string[],
    allAssignments: VirtualMonthAssignment[],
    month: number,
    year: number
): string[] => {
    const daysInMonth = new Date(year, month, 0).getDate()

    // สร้าง assignment map ของ แต่ละ user
    const userAssignmentMap = new Map<string, Set<number>>()

    for (const assignment of allAssignments) {
        const date = new Date(assignment.date)

        const assignmentMonth = date.getMonth() + 1
        const assignmentYear = date.getFullYear()

        if (assignmentMonth !== month || assignmentYear !== year) {
            continue
        }

        if (!userAssignmentMap.has(assignment.userId)) {
            userAssignmentMap.set(assignment.userId, new Set())
        }

        userAssignmentMap.get(assignment.userId)!.add(date.getDate())
    }

    // check แต่ละ user ต้องมีอย่างน้อย 1 record ต่อวัน
    for (const [userId, assignnedDays] of userAssignmentMap.entries()) {
        const missingDays: number[] = []

        for (let day = 1; day <= daysInMonth; day++) {
            if(!assignnedDays.has(day)){
                missingDays.push(day)
            }
        }

        if (missingDays.length > 0) {
            warning.push(WarningType.USER_MISSING_ASSIGNMENT)
            break
        }
    }

    return warning
}