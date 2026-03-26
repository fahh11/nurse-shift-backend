import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentOutputDto {
    shiftAssignmentId: string
    shiftTemplateId: string | null
    wardId: string
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}