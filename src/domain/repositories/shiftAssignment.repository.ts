import { ShiftAssignment } from '@service/domain/entities/shiftAssignment'

export interface ShiftAssignmentRepository {
  create(shiftAssignment: ShiftAssignment): Promise<ShiftAssignment>
  findById(shiftAssignmentId: string): Promise<ShiftAssignment | null>
  findAll(): Promise<ShiftAssignment[]>
  update(shiftAssignment: ShiftAssignment): Promise<ShiftAssignment>
  delete(shiftAssignmentId: string): Promise<void>
}