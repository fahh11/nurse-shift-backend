import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentBody {
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    shiftTemplateId: string
}