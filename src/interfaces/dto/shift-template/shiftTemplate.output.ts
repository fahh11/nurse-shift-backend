import { ShiftTemplateType } from '@service/enums/shiftTemplateType'

export interface CreateShiftTemplateOutputDto {
    shiftTemplateId: string
    wardId: string
    type: ShiftTemplateType
    startTime: string
    endTime: string
    createdAt: Date
    updatedAt: Date
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