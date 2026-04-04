import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type';
import { createShiftSwapRequest } from '@service/use-cases/shift-swap-request/createShiftSwapRequest';
import { PrismaShiftSwapRequestRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftSwapRequest.repository.impl';
import { PrismaShiftAssignmentRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftAssignment.repository.impl';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';

const shiftSwapRequestRepo = new PrismaShiftSwapRequestRepository()
const shiftAssignmentRepo = new PrismaShiftAssignmentRepository()
const userRepo = new PrismaUserRepository()

export const ShiftSwapRequestController = {
    create: async (request: FastifyRequest<{Body: CreateShiftSwapRequestBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await createShiftSwapRequest(
            input,
            currentUser.userId,
            request.log,
            {shiftSwapRequestRepo, userRepo, shiftAssignmentRepo}
        );
        return reply.send(result);
    },
}