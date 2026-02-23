import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShiftRequirementBody } from '@service/types/shiftRequirement.type';
import { createShiftRequirement } from '@service/use-cases/shift-requirement/createShiftRequirement';
import { PrismaShiftRequirementRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftRequirement.repository.impl';
import { PrismaShiftTemplateRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftTemplate.repository.impl';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl';

const shiftTemplateRepo = new PrismaShiftTemplateRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()
const shiftRequirementRepo = new PrismaShiftRequirementRepository()

export const ShiftRequirementController = {
    create: async (request: FastifyRequest<{Body: CreateShiftRequirementBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const { shiftTemplateId } = request.params as { shiftTemplateId: string }

        const result = await createShiftRequirement(
            input,
            shiftTemplateId,
            currentUser.userId,
            request.log,
            {shiftRequirementRepo, shiftTemplateRepo, userRepo, wardRepo}
        );
        return reply.send(result);
    },
}