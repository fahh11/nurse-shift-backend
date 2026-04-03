// import { WarningType } from '@service/enums/warningType'
// import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'
// import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

// export const validateEmergencyAssignment = (
//     warnings: string[],
//     allAssignments: VirtualMonthAssignment[],
//     month: number,
//     year: number
// ): string[] => {
//     const daysInMonth = new Date(year, month, 0).getDate()
//     const emergencyAssignments = allAssignments.filter(
//         a => a.assignmentType === ShiftAssignmentType.EMERGENCY
//     )

//     // สร้าง emergency assignment set ของเดือน
//     const userEmergencyAssignmentSet = new Set<number>

//     const emergencyCountMap = new Set<number>

//     for (const assignment of emergencyAssignments) {
//         const date = new Date(assignment.date)
//         const day = date.getDate()

//         const assignmentMonth = date.getMonth() + 1
//         const assignmentYear = date.getFullYear()

//         if (assignmentMonth !== month || assignmentYear !== year) {
//             continue
//         }

//         if (!emergencyCountMap.has(day)) {
//             emergencyCountMap.set(date, 0)
//         }

//         emergencyCountMap.set(date, emergencyCountMap.get(date)! + 1)
//     }

//     console.log(emergencyCountMap)

//     // cheak ว่าทุกวันมั emegercy อย่างน้อย 1
//     for (let day = 0; day <= daysInMonth; day++) {
//         if ()
//     }
    
//     return warnings
// }