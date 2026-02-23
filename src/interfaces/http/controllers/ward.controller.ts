import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateWardBody, UpdateWardBody } from '@service/types/ward.type'
import { createWard } from '@service/use-cases/ward/createWard'
import { updateWard } from '@service/use-cases/ward/updateWard'
import { getAllWardInHospital, enterWard } from '@service/use-cases/ward/getWard'
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { PrismaWardMemberRepository } from '@service/infrastructure/persistence/prisma/repositories/wardMember.repository.impl'
import { PrismaHospitalRepository } from '@service/infrastructure/persistence/prisma/repositories/hospital.repository.impl'

const wardRepo = new PrismaWardRepository()
const userRepo = new PrismaUserRepository()
const wardMemberRepo = new PrismaWardMemberRepository()
const hospitalRepo = new PrismaHospitalRepository()

export const WardController = {
    create: async (request: FastifyRequest<{Body: CreateWardBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await createWard(
            input,
            currentUser.userId,
            request.log,
            {wardRepo, userRepo, wardMemberRepo}
        );
        return reply.send(result);
    },
    
    update: async (request: FastifyRequest<{Body: UpdateWardBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await updateWard(
            input,
            currentUser.userId,
            request.log,
            {wardRepo, userRepo}
        );
        return reply.send(result);
    },

    getAllWardInHospital: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const result = await getAllWardInHospital(
            currentUser.userId,
            request.log,
            {wardRepo, userRepo, wardMemberRepo}
        );
        return reply.send(result);
    },

    enterWard: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const { wardId } = request.params as { wardId: string }

        const result = await enterWard(
            wardId,
            currentUser.userId,
            request.log,
            {wardRepo, userRepo, wardMemberRepo}
        );
        return reply.send(result);
    }
}