import { ShiftTemplateType } from '@service/enums/shiftTemplateType'

export interface CreateShiftTemplateBody {
    wardId: string
    type: ShiftTemplateType
    startTime: string
    endTime: string
    requiredPeople: number
}

export interface UpdateShiftTemplateBody {
    startTime?: string
    endTime?: string
}