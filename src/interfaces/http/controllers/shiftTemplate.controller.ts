import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateShiftTemplateBody, UpdateShiftTemplateBody } from '@service/types/shiftTemplate.type'
import { createShiftTemplate } from '@service/use-cases/shift-template/createShiftTemplate'
import { updateShiftTemplate } from '@service/use-cases/shift-template/updateShiftTemplate'
import { getAllShiftTemplateInWard } from '@service/use-cases/shift-template/getShiftTemplate'
import { PrismaShiftTemplateRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftTemplate.repository.impl'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl'
import { PrismaShiftRequirementRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftRequirement.repository.impl'

const shiftTemplateRepo = new PrismaShiftTemplateRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()
const shiftRequirementRepo = new PrismaShiftRequirementRepository()

export const ShiftTemplateController = {
    create: async (request: FastifyRequest<{Body: CreateShiftTemplateBody[]}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await createShiftTemplate(
            input,
            currentUser.userId,
            request.log,
            {shiftTemplateRepo, shiftRequirementRepo, userRepo, wardRepo}
        );
        return reply.send(result);
    },
    
    update: async (request: FastifyRequest<{Body: UpdateShiftTemplateBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const { shiftTemplateId } = request.params as { shiftTemplateId: string }

        const result = await updateShiftTemplate(
            input,
            shiftTemplateId,
            currentUser.userId,
            request.log,
            {shiftTemplateRepo, userRepo, wardRepo}
        );
        return reply.send(result);
    },

    getAllShiftTemplateInWard: async (request: FastifyRequest, reply: FastifyReply) => {
        // const input = request.body
        // const currentUser = request.user

        const { wardId } = request.params as { wardId: string }

        const { year, month } = request.query as {
            year: number;
            month: number;
        };

        const result = await getAllShiftTemplateInWard(
            wardId,
            year,
            month,
            request.log,
            {shiftTemplateRepo, shiftRequirementRepo}
        );
        return reply.send(result);
    }
}