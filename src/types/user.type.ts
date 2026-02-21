export interface CreateUserBody {
    personalEmail: string
    googleEmailId: string
}

export interface UpdateUserForCompleteProfileBody {
    userId: string
    firstName: string
    lastName: string
    nickname?: string
    birthDate?: Date
    lineUserId: string
    mobilePhone: string
    hospitalId: string
}

export interface UpdateUserBody {
    userId: string
    firstName?: string
    lastName?: string
    nickname?: string
    birthDate?: Date
    lineUserId?: string
    mobilePhone?: string
    hospitalId?: string
}