import { WarningType } from '@service/enums/warningType'
import { VirtualMonthAssignment } from '@service/types/validateAssignment.type'
import { VirtualShiftTemplate } from '@service/types/validateAssignment.type'
import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'
import { ShiftTemplateType } from '@service/enums/shiftTemplateType'

export const validateRequiredAssignment = (
    warnings: string[],
    allAssignments: VirtualMonthAssignment[],
    allShiftTemplate: VirtualShiftTemplate[],
    month: number,
    year: number
): string[] => {
    const daysInMonth = new Date(year, month, 0).getDate()
    const filterShiftAssignments = allAssignments.filter(
        a => a.assignmentType === ShiftAssignmentType.SHIFT
    )

    // สร้าง shift template map
    const shiftTemplateMap = new Map<string, { type: ShiftTemplateType, required: number }>()

    for (const template of allShiftTemplate) {
        const templateId = template.shiftTemplateId

        if (!shiftTemplateMap.has(templateId)) {
            shiftTemplateMap.set(templateId, {
                type: template.type as ShiftTemplateType, 
                required: template.requiredPeople
            })
        }
    }

    console.log(shiftTemplateMap)

    // สร้าง map เพื่อนับจำนวนคนในเวร
    const shiftAssignmentMap = new Map<number, Map<ShiftTemplateType, number>>()

    for (const assignment of filterShiftAssignments) {
        const date = new Date(assignment.date)
        const day = date.getDate()

        const assignmentMonth = date.getMonth() + 1
        const assignmentYear = date.getFullYear()

        if (assignmentMonth !== month || assignmentYear !== year) {
            continue
        }

        if (!shiftAssignmentMap.has(day)) {
            shiftAssignmentMap.set(day, new Map<ShiftTemplateType, number>())
        }

        const typeMap = shiftAssignmentMap.get(day)
        
        const template = shiftTemplateMap.get(assignment.shiftTemplateId!)
        const type = template!.type

        if (!typeMap?.has(type)) {
            typeMap?.set(type, 0)
        }

        typeMap?.set(type, typeMap.get(type)! + 1)

    }

    console.log(shiftAssignmentMap)
    console.log(allShiftTemplate)

    // cheak ว่าทุกวันมีคนครบ requirement ไหม
    for (let day = 1; day <= daysInMonth; day++) {
        const typeMap = shiftAssignmentMap.get(day)

        if (!typeMap) {
            warnings.push(WarningType.SHIFT_REQUIREMENT_MISSING)
            break
        }

        for (const [type, assignedCount] of typeMap.entries()) {
            // หาจำนวนที่ required
            const templateInfo = Array.from(shiftTemplateMap.values()).find(t => t.type === type)
            const required = templateInfo?.required ?? 0

            if (assignedCount < required) {
                warnings.push(WarningType.SHIFT_REQUIREMENT_MISSING)
            }
        }
    }
    
    return warnings
}