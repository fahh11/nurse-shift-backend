import { WardMember } from '@service/domain/entities/wardMember'

export interface WardMemberRepository {
  create(wardMember: WardMember): Promise<WardMember>
  findById(wardMemberId: string): Promise<WardMember | null>
  findByUserId(userId: string): Promise<WardMember[]>
  findByWardId(wardId: string): Promise<WardMember[]>
  findByUserIdAndWardId(userId: string, wardId: string): Promise<WardMember | null>
  findAll(): Promise<WardMember[]>
  delete(wardMemberId: string): Promise<void>
}