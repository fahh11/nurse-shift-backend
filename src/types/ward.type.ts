import { WardStatus } from "@service/enums/wardStatus"

export interface CreateWardBody {
    wardName: string
    hospitalId: string
}

export interface UpdateWardBody {
    wardId: string
    wardName?: string
    hospitalId?: string
    joinCodeStatus?: boolean
    status?: WardStatus
}