export interface CreateUserBody {
    personalEmail: string
    googleEmailId: string
}

export interface UpdateUserForCompleteProfileBody {
    email: string
    firstName: string
    lastName: string
    hospitalId: string
}

export interface UpdateUserBody {
    firstName?: string
    lastName?: string
    lineUserId?: string
    hospitalId?: string
}