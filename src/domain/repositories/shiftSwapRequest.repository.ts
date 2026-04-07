import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest'

export interface ShiftSwapRequestRepository {
  create(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest>
  findById(shiftSwapRequestId: string): Promise<ShiftSwapRequest | null>
  findByWardId(wardId: string): Promise<ShiftSwapRequest[]>
  findByShiftAssignmentId(shiftAssignmentId: string): Promise<ShiftSwapRequest[]>
  findByUserId(userId: string): Promise<ShiftSwapRequest[]>
  findAll(): Promise<ShiftSwapRequest[]>
  update(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest>
  delete(shiftSwapRequestId: string): Promise<void>
}