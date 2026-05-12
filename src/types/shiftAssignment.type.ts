import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentBody {
    shiftAssignmentId: string
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    shiftTemplateId: string | null
}

export interface CreateShiftAssignmentItems {
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    shiftTemplateId: string | null
}