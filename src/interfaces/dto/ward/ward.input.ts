import { WardStatus } from '@service/enums/wardStatus'

export interface CreateWardInputDto {
    wardName: string
    hospitalId: string
    joinCode: string
    joinCodeStatus: boolean
    status: WardStatus
    createdBy: string
    updatedBy: string
}