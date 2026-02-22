import { OAuth2Client } from 'google-auth-library'
import { User } from '@service/domain/entities/user'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { JwtService } from '@service/domain/ports/jwtService'
import { CreateGoogleAuthBody } from '@service/types/auth.type'
import { CreateGoogleAuthOutputDto } from '@service/interfaces/dto/auth/auth.output'
import { googleOAuthClient } from '@service/infrastructure/http/googleOauth'

export const authWithGoogle = async (
  idToken: string,
  repos: { 
    userRepo: UserRepository,
    jwtService: JwtService
 }
): Promise<CreateGoogleAuthOutputDto> => {
    const ticket = await googleOAuthClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    })
    
    const payload = ticket.getPayload()
    if (!payload?.email) {
        throw new Error('Invalid Google token')
    }

    const googleEmail = payload.email

    // 🔎 หา user
    let user = await repos.userRepo.findByPersonalEmail(googleEmail)

    // 🆕 ถ้าไม่มี → create
    if (!user) {
        const newUser = new User({
            personalEmail: payload.email,
            googleEmailId: payload.sub,
            profileCompleted: false,
        })

        user = await repos.userRepo.create(newUser)
    }

    // ✅ สร้าง JWT token
    const accessToken = repos.jwtService.sign({
        userId: user.userId,
        email: user.personalEmail,
        profileCompleted: user.profileCompleted,
    })


    return {
        accessToken: accessToken,
        userId: user.userId,
        personalEmail: user.personalEmail,
        profileCompleted: user.profileCompleted
    }

}
