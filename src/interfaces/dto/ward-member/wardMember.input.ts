import { WardMemberRole } from '@service/enums/wardMemberRole'

export interface CreateWardMemberInputDto {
    userId: string
    wardId: string
    role: WardMemberRole
}