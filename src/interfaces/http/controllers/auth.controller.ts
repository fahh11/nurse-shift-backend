import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateGoogleAuthBody } from '@service/types/auth.type'
import { authWithGoogle } from '@service/use-cases/auth/authWithGoogle'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { JwtServiceImpl } from '@service/infrastructure/http/jwtServiceImpl'

const userRepo = new PrismaUserRepository()

export const AuthController = {
  googleLogin: async (request: FastifyRequest<{Body: CreateGoogleAuthBody}>, reply: FastifyReply) => {
    const input = request.body
    const jwtService = new JwtServiceImpl(request.server)

    const result = await authWithGoogle(input, { userRepo, jwtService })
    return reply.send(result)
  },

  getMe: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user

    return reply.send({
        user: {
            userId: user.userId,
            personalEmail: user.email,
        }
    })
  }
}
