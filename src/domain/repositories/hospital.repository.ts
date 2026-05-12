import { Hospital } from '@service/domain/entities/hospital'

export interface HospitalRepository {
  create(hospital: Hospital): Promise<Hospital>
  findById(hospitalId: string): Promise<Hospital | null>
  findAll(): Promise<Hospital[]>
  update(hospital: Hospital): Promise<Hospital>
  delete(hospitalId: string): Promise<void>
}
