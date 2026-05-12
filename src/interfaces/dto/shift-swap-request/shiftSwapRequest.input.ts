import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus'

export interface CreateShiftSwapRequestInputDto {
    requesterUserId: string
    approverUserId: string
    requesterAssignmentId: string
    approverAssignmentId: string
    status: ShiftSwapRequestStatus
    note: string | null
}