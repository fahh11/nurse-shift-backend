import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateHospitalBody } from '@service/types/hospital.type'
import { UpdateHospitalBody } from '@service/types/hospital.type'
import { createHospital } from '@service/use-cases/hospital/createHospital'
import { updateHospital } from '@service/use-cases/hospital/updateHospital'
import { PrismaHospitalRepository } from '@service/infrastructure/persistence/prisma/repositories/hospital.repository.impl'

const hospitalRepo = new PrismaHospitalRepository()

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
    }
}