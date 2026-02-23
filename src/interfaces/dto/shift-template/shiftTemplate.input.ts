import { ShiftTemplateType } from '@service/enums/shiftTemplateType'

export interface CreateShiftTemplateInputDto {
    wardId: string
    type: ShiftTemplateType
    startTime: string
    endTime: string
}