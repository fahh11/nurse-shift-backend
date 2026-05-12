export interface CreateHospitalBody {
    name: string
    address: string
}

export interface UpdateHospitalBody {
    hospitalId: string
    name?: string
    address?: string
}