import { ShiftTemplateType } from '@service/enums/shiftTemplateType'

export interface CreateShiftTemplateOutputDto {
    shiftTemplate: {
        shiftTemplateId: string
        wardId: string
        type: ShiftTemplateType
        startTime: string
        endTime: string
        createdAt: Date
        updatedAt: Date
    }
    shiftRequirement: {
        shiftRequirementId: string
        shiftTemplateId: string
        requiredPeople: number
        effectiveFrom: Date
        effectiveTo: Date | null
        createdAt: Date
        updatedAt: Date
    }
}

export interface UpdateShiftTemplateOutputDto {
    shiftTemplateId: string
    wardId: string
    type: ShiftTemplateType
    startTime: string
    endTime: string
    createdAt: Date
    updatedAt: Date
}