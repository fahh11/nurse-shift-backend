import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type';
import { createShiftAssignment } from '@service/use-cases/shift-assignment/createdShiftAssignment';
import { getSummaryMonthShiftAssignment } from '@service/use-cases/shift-assignment/getShiftAssignment';
import { getShiftAssignmentforCreateSwap } from '@service/use-cases/shift-assignment/getShiftAssignment';
import { deleteShiftAssignment } from '@service/use-cases/shift-assignment/deleteShiftAssignment';
import { PrismaShiftAssignmentRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftAssignment.repository.impl';
import { PrismaShiftTemplateRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftTemplate.repository.impl';
import { PrismaShiftRequirementRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftRequirement.repository.impl';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl';
import { PrismaWardMemberRepository } from '@service/infrastructure/persistence/prisma/repositories/wardMember.repository.impl';

const shiftAssignmentRepo = new PrismaShiftAssignmentRepository()
const shiftTemplateRepo = new PrismaShiftTemplateRepository()
const shiftRequirementRepo = new PrismaShiftRequirementRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()
const wardMemberRepo = new PrismaWardMemberRepository()

export const ShiftAssignmentController = {
    create: async (request: FastifyRequest<{Body: CreateShiftAssignmentBody[]}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const { wardId } = request.params as { wardId: string }
        const { year, month } = request.query as { year: number, month: number }

        const result = await createShiftAssignment(
            input,
            wardId,
            currentUser.userId,
            Number(year),
            Number(month),
            request.log,
            {shiftAssignmentRepo, shiftTemplateRepo, shiftRequirementRepo, userRepo, wardRepo, wardMemberRepo}
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
            {shiftAssignmentRepo, shiftTemplateRepo, userRepo, wardMemberRepo}
        );
        return reply.send(result);
    },

    getShiftAssignmentForCreateSwap: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user
        const { wardId } = request.params as { wardId: string }
        const { year, month, approverUserId, day } = request.query as {
            year: number
            month: number
            approverUserId?: string
            day?: number
        }
        
        const result = await getShiftAssignmentforCreateSwap(
            currentUser.userId,
            wardId,
            approverUserId,
            year,
            month,
            day,
            request.log,
            {shiftAssignmentRepo, shiftTemplateRepo, userRepo, wardRepo}
        );
        return reply.send(result);
    },

    delete: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user
        const { shiftAssignmentId } = request.params as { shiftAssignmentId: string }

        const result = await deleteShiftAssignment(
            shiftAssignmentId,
            currentUser.userId,
            request.log,
            {shiftAssignmentRepo, userRepo, wardRepo, wardMemberRepo}
        );

        return reply.send(result);
    }
}