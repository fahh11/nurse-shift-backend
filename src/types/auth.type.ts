export interface CreateGoogleAuthBody {
    code: string
}

export interface JwtPayload {
    userId: string
    email?: string
    profileComplete: boolean
}
