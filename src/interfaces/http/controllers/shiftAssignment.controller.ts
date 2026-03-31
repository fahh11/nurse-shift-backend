import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type';
import { createShiftAssignment } from '@service/use-cases/shift-assignment/createdShiftAssignment';
import { getSummaryMonthShiftAssignment } from '@service/use-cases/shift-assignment/getShiftAssignment';
import { PrismaShiftAssignmentRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftAssignment.repository.impl';
import { PrismaShiftTemplateRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftTemplate.repository.impl';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl';
import { PrismaWardMemberRepository } from '@service/infrastructure/persistence/prisma/repositories/wardMember.repository.impl';


const shiftAssignmentRepo = new PrismaShiftAssignmentRepository()
const shiftTemplateRepo = new PrismaShiftTemplateRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()
const wardMemberRepo = new PrismaWardMemberRepository()

export const ShiftAssignmentController = {
    create: async (request: FastifyRequest<{Body: CreateShiftAssignmentBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const { wardId } = request.params as { wardId: string }

        const result = await createShiftAssignment(
            input,
            wardId,
            currentUser.userId,
            request.log,
            {shiftAssignmentRepo, shiftTemplateRepo, userRepo, wardRepo, wardMemberRepo}
        );
        return reply.send(result);
    },

    getSummaryMonthShiftAssignment: async (request: FastifyRequest, reply: FastifyReply) => {
        const { wardId } = request.params as { wardId: string }
        const { year, month } = request.query as { year: number, month: number }

        const result = await getSummaryMonthShiftAssignment(
            wardId,
            year,
            month,
            request.log,
            {shiftAssignmentRepo, shiftTemplateRepo, userRepo}
        );
        return reply.send(result);
    },
}