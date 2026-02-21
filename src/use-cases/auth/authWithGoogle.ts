import { OAuth2Client } from 'google-auth-library'
import { CustomError, ErrorDescription } from '@service/helpers/error'
import { StatusCode } from '@service/enums/statusCode'
import { User } from '@service/domain/entities/user'
import { UserRepository } from '@service/domain/repositories/user.repository'
import { JwtService } from '@service/domain/ports/jwtService'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const authWithGoogle = async (
  idToken: string,
  repos: { 
    userRepo: UserRepository,
    jwtService: JwtService
 }
) => {
    const ticket = await client.verifyIdToken({
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
        profileComplete: user.profileCompleted,
    })


    return {
        accessToken,
        user,
        profileCompleted: user.profileCompleted
    }

}
