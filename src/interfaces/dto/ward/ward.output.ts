import { WardStatus } from '@service/enums/wardStatus'

export interface CreateWardOutputDto {
    wardId: string
    wardName: string
    hospitalId: string
    joinCode: string
    joinCodeStatus: boolean
    status: WardStatus
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}

export interface UpdateWardOutputDto {
    wardId: string
    wardName: string
    hospitalId: string
    joinCode: string
    joinCodeStatus: boolean
    status: WardStatus
    createdBy: string
    updatedBy: string
    createdAt: Date
    updatedAt: Date
}