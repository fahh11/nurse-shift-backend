import { WardMemberRole } from '@service/enums/wardMemberRole';

export interface CreateWardMemberOutputDto {
    wardMemberId: string
    userId: string
    wardId: string
    role: WardMemberRole
    createdAt: Date
}