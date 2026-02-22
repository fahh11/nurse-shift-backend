import { env } from '@service/config/env' 
import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateGoogleAuthBody } from '@service/types/auth.type'
import { authWithGoogle } from '@service/use-cases/auth/authWithGoogle'
import { getMe } from '@service/use-cases/auth/getMe'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { JwtServiceImpl } from '@service/infrastructure/http/jwtServiceImpl'
import { googleOAuthClient } from '@service/infrastructure/http/googleOauth'

const userRepo = new PrismaUserRepository()

export const AuthController = {
  googleLogin: async (request: FastifyRequest<{ Querystring: { code: string } }>, reply: FastifyReply) => {
    // const input = request.body
    // const jwtService = new JwtServiceImpl(request.server)

    // // const { tokenId } = await client.getToken(code as string)

    // const result = await authWithGoogle(input, { userRepo, jwtService })
    // return reply.send(result)

    try {
        const { code } = request.query

        if (!code) {
          return reply.status(400).send({ message: "No code provided" })
        }
        console.log("==========Code=========")
        console.log(code)
        console.log("==========Code=========")

        const jwtService = new JwtServiceImpl(request.server)

        // ✅ เรียกจาก OAuth client ไม่ใช่ schema
        const { tokens } = await googleOAuthClient.getToken(code)
        console.log("===========Token========")
        console.log(tokens)
        console.log("===================")

        const result = await authWithGoogle(
          tokens.id_token!,
          { userRepo, jwtService }
        )

        const params = new URLSearchParams({
          accessToken: result.accessToken,
          profileCompleted: String(result.profileCompleted),
        })

        return reply.redirect(
          `${env.frontEnd.redirectUrl}/login?${params.toString()}`
        )

    } catch (err) {
        console.error(err)
        return reply.status(500).send({ message: "Google auth failed" })
    }
  },

  getMe: async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user

    const result = await getMe(
        user.userId,
        request.log,
        {userRepo}
    );
    return reply.send(result);
  },

  logout: async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ message: "Logged out successfully" })
  }
}
