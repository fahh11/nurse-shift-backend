import { WarningType } from '@service/enums/warningType'
import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export const validateEmergencyAssignment = (
    warnings: string[],
    allAssignments: VirtualMonthAssignment[],
    month: number,
    year: number
): string[] => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const emergencyAssignments = allAssignments.filter(
        a => a.assignmentType === ShiftAssignmentType.EMERGENCY
    )

    // สร้าง emergency assignment set ของเดือน
    const emergencyAssignmentSet = new Set<number>()

    for (const assignment of emergencyAssignments) {
        const date = new Date(assignment.date)

        const assignmentMonth = date.getMonth() + 1
        const assignmentYear = date.getFullYear()

        if (assignmentMonth !== month || assignmentYear !== year) {
            continue
        }

        emergencyAssignmentSet.add(date.getDate())
    }

    let completeEmergency = true

    // cheak ว่าทุกวันมั emegercy อย่างน้อย 1
    for (let day = 1; day <= daysInMonth; day++) {
        if (!emergencyAssignmentSet.has(day)) {
            completeEmergency = false
            break
        }
    }

    if (!completeEmergency) {
        warnings.push(WarningType.EMERGENCY_SHIFT_MISSING)
    }
    
    return warnings
}