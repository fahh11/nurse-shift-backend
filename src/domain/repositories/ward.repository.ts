import { Ward } from '@service/domain/entities/ward';

export interface WardRepository {
  create(ward: Ward): Promise<Ward>
  findById(wardId: string): Promise<Ward | null>
  findByHospitalId(hospitalId: string): Promise<Ward[]>
  findAll(): Promise<Ward[]>
  update(ward: Ward): Promise<Ward>
  delete(wardId: string): Promise<void>
}