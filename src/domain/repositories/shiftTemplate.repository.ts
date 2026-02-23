import { ShiftTemplate } from '@service/domain/entities/shiftTemplate'

export interface ShiftTemplateRepository {
  create(shiftTemplate: ShiftTemplate): Promise<ShiftTemplate>
  findById(shiftTemplateId: string): Promise<ShiftTemplate | null>
  findByWardId(wardId: string): Promise<ShiftTemplate[]>
  findAll(): Promise<ShiftTemplate[]>
  update(shiftTemplate: ShiftTemplate): Promise<ShiftTemplate>
  delete(shiftTemplateId: string): Promise<void>
}