import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentBody {
  year: number
  month: number
  assignments: CreateShiftAssignmentItems[]
}

export interface CreateShiftAssignmentItems {
    userId: string
    date: Date
    assignmentType: ShiftAssignmentType
    shiftTemplateId: string | null
}