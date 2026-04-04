import { ShiftSwapRequest } from '@service/domain/entities/shiftSwapRequest'

export interface ShiftSwapRequestRepository {
  create(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest>
  findById(shiftSwapRequestId: string): Promise<ShiftSwapRequest | null>
  findAll(): Promise<ShiftSwapRequest[]>
  update(shiftSwapRequest: ShiftSwapRequest): Promise<ShiftSwapRequest>
  delete(shiftSwapRequestId: string): Promise<void>
}