export interface CreateUserOutputDto {
    userId: string
    firstName: string | null
    lastName: string | null
    personalEmail: string
    googleEmailId: string
    lineUserId: string | null
    hospitalId: string | null
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UpdateUserForCompleteProfileOutputDto {
    userId: string
    firstName: string
    lastName: string
    personalEmail: string
    googleEmailId: string
    lineUserId?: string | null
    hospitalId: string
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UpdateUserOutputDto {
    userId: string
    firstName: string
    lastName: string
    personalEmail: string
    googleEmailId: string
    lineUserId?: string
    hospitalId: string
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}