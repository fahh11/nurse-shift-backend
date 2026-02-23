import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateHospitalBody } from '@service/types/hospital.type'
import { UpdateHospitalBody } from '@service/types/hospital.type'
import { createHospital } from '@service/use-cases/hospital/createHospital'
import { updateHospital } from '@service/use-cases/hospital/updateHospital'
import { getAllHospital, getUserHospital } from '@service/use-cases/hospital/getHospital'
import { PrismaHospitalRepository } from '@service/infrastructure/persistence/prisma/repositories/hospital.repository.impl'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'

const hospitalRepo = new PrismaHospitalRepository()
const userRepo = new PrismaUserRepository()

export const HospitalController = {
    create: async (request: FastifyRequest<{Body: CreateHospitalBody}>, reply: FastifyReply) => {
        const input = request.body

        const result = await createHospital(input, request.log, {hospitalRepo});
        return reply.send(result);
    },

    update: async (request: FastifyRequest<{Body: UpdateHospitalBody}>, reply: FastifyReply) => {
        const input = request.body

        const result = await updateHospital(input, request.log, {hospitalRepo});
        return reply.send(result);
    },

    getAllHospital: async (request: FastifyRequest, reply: FastifyReply) => {
        const result = await getAllHospital(request.log, {hospitalRepo});
        return reply.send(result)
    },

    getUserHospital: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const result = await getUserHospital(
            currentUser.userId,
            request.log, 
            {hospitalRepo, userRepo}
        );

        return reply.send(result)
    },
}