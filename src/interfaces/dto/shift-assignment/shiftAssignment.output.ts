import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentOutputDto {
    shiftAssignmentId: string
    shiftTemplateId: string
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    createdAt: Date
    updatedAt: Date
}