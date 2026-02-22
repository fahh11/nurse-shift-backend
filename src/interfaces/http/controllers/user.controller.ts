import { FastifyRequest, FastifyReply } from 'fastify'
import { UpdateUserForCompleteProfileBody, UpdateUserBody } from '@service/types/user.type'
import { updateUserForCompleteProfile, updateUser } from '@service/use-cases/user/updateUser'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'

const userRepo = new PrismaUserRepository()

export const UserController = {
    updateForCompleteProfile: async (request: FastifyRequest<{Body: UpdateUserForCompleteProfileBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await updateUserForCompleteProfile(input, currentUser.userId, request.log, {userRepo});
        return reply.send(result);
    },
    
    update: async (request: FastifyRequest<{Body: UpdateUserBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await updateUser(input, currentUser.userId, request.log, {userRepo});
        return reply.send(result);
    }
}