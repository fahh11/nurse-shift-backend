import { ShiftRequirement } from '@service/domain/entities/shiftRequirement'

export interface ShiftRequirementRepository {
  create(shiftRequirement: ShiftRequirement): Promise<ShiftRequirement>
  findById(shiftRequirementId: string): Promise<ShiftRequirement | null>
  findByShiftTemplateId(shiftTemplateId: string): Promise<ShiftRequirement[]>
  findActiveByShiftTemplateId(shiftTemplateId: string): Promise<ShiftRequirement | null>
  findAll(): Promise<ShiftRequirement[]>
  update(shiftRequirement: ShiftRequirement): Promise<ShiftRequirement>
  delete(shiftRequirementId: string): Promise<void>
}