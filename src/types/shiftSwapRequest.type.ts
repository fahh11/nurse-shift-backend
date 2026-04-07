import { ShiftSwapRequestStatus } from "@service/enums/shiftSwapRequestStatus"

export interface CreateShiftSwapRequestBody {
    approverUserId: string
    requesterAssignmentId: string
    approverAssignmentId: string
    note: string | null
}

export interface UpdateShiftSwapRequestBody {
    status: ShiftSwapRequestStatus
    note: string
}