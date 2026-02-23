import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentInputDto {
    shiftTemplateId: string
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
}