import { ShiftAssignmentType } from '@service/enums/shiftAssignmentType'

export interface CreateShiftAssignmentResponse {
    results: CreateShiftAssignmentOutputDto[]  
    warnings: string[]
}

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
    deletedAt: Date | null
}