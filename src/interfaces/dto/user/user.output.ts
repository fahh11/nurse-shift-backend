export interface CreateUserOutputDto {
    userId: string
    firstName: string | null
    lastName: string | null
    nickname: string | null
    birthDate: Date | null
    personalEmail: string
    googleEmailId: string
    lineUserId: string | null
    mobilePhone: string | null
    hospitalId: string | null
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UpdateUserForCompleteProfileOutputDto {
    userId: string
    firstName: string
    lastName: string
    nickname: string | null
    birthDate: Date | null
    personalEmail: string
    googleEmailId: string
    lineUserId: string
    mobilePhone: string
    hospitalId: string
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}

export interface UpdateUserOutputDto {
    userId: string
    firstName: string
    lastName: string
    nickname: string | null
    birthDate: Date | null
    personalEmail: string
    googleEmailId: string
    lineUserId: string
    mobilePhone: string
    hospitalId: string
    profileCompleted: boolean
    createdAt: Date
    updatedAt: Date
}