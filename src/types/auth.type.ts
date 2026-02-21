export interface CreateGoogleAuthBody {
    tokenId: string
}

export interface JwtPayload {
    userId: string
    email?: string
    profileComplete: boolean
}
