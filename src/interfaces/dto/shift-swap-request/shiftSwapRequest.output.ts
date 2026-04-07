import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'

export interface CreateShiftSwapRequestOutputDto {
    shiftSwapRequestId: string
    requesterUserId: string
    approverUserId: string
    requesterAssignmentId: string
    approverAssignmentId: string
    status: ShiftSwapRequestStatus
    note: string | null
    requestedAt: Date
    respondedAt: Date | null
}

export interface UpdateShiftSwapRequestOutputDto {
    shiftSwapRequestId: string
    requesterUserId: string
    approverUserId: string
    requesterAssignmentId: string
    approverAssignmentId: string
    status: ShiftSwapRequestStatus
    note: string | null
    requestedAt: Date
    respondedAt: Date | null
}