import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type';
import { createShiftSwapRequest } from '@service/use-cases/shift-swap-request/createShiftSwapRequest';
import { updateShiftSwapRequest } from '@service/use-cases/shift-swap-request/updateShiftSwapRequest';
import { getAllShiftSwapRequest } from '@service/use-cases/shift-swap-request/getAllShiftSwapRequest';
import { PrismaShiftSwapRequestRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftSwapRequest.repository.impl';
import { PrismaShiftAssignmentRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftAssignment.repository.impl';
import { PrismaShiftTemplateRepository } from '@service/infrastructure/persistence/prisma/repositories/shiftTemplate.repository.impl';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl';
import { PrismaWardMemberRepository } from '@service/infrastructure/persistence/prisma/repositories/wardMember.repository.impl';
import { ShiftSwapRequestStatus } from '@service/enums/shiftSwapRequestStatus';
import { lineService } from '@service/infrastructure/line/line.service';

const shiftSwapRequestRepo = new PrismaShiftSwapRequestRepository()
const shiftAssignmentRepo = new PrismaShiftAssignmentRepository()
const shiftTemplateRepo = new PrismaShiftTemplateRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()
const wardMemberRepo = new PrismaWardMemberRepository()

export const ShiftSwapRequestController = {
    create: async (request: FastifyRequest<{Body: CreateShiftSwapRequestBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await createShiftSwapRequest(
            input,
            currentUser.userId,
            request.log,
            {shiftSwapRequestRepo, userRepo, shiftAssignmentRepo, shiftTemplateRepo},
            {lineService}
        );
        return reply.send(result);
    },

    update: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const { shiftSwapRequestId } = request.params as { shiftSwapRequestId: string }

        const { status, note } = request.query as {
            status: ShiftSwapRequestStatus,
            note: string
        }

        const result = await updateShiftSwapRequest(
            shiftSwapRequestId,
            currentUser.userId,
            status,
            note,
            request.log,
            {shiftSwapRequestRepo, userRepo, shiftAssignmentRepo},
            {lineService},
        );
        return reply.send(result);
    },

    getAllShiftSwapRequest: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const { wardId } = request.params as { wardId: string }

        const result = await getAllShiftSwapRequest(
            currentUser.userId,
            wardId,
            request.log,
            {
                shiftSwapRequestRepo,
                shiftAssignmentRepo, 
                shiftTemplateRepo, 
                userRepo, 
                wardRepo, 
                wardMemberRepo,
            },
        );
        return reply.send(result);
    },
}