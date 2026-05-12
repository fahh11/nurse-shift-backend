import { Ward } from '@service/domain/entities/ward';
import { WardStatus } from '@service/enums/wardStatus';

export interface WardRepository {
  create(ward: Ward): Promise<Ward>
  findById(wardId: string): Promise<Ward | null>
  findByHospitalId(hospitalId: string, status?: WardStatus): Promise<Ward[]>
  findAll(): Promise<Ward[]>
  update(ward: Ward): Promise<Ward>
  delete(wardId: string): Promise<void>
}