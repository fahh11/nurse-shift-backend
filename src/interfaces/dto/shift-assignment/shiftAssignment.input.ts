import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentInputDto {
    shiftTemplateId: string | null
    wardId: string
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    createdBy: string
    updatedBy: string
}