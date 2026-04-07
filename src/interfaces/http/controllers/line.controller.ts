import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { lineConnect } from '@service/use-cases/line/lineConnect'
import { lineWebhook } from '@service/use-cases/line/lineWebhook'

const userRepo = new PrismaUserRepository()

export const LineController = {
    lineConnect: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const result = await lineConnect(
            currentUser.userId,
            request.log,
            {userRepo}
        );
        return reply.send(result);
    },

    lineWebhook: async (request: FastifyRequest, reply: FastifyReply) => {
        const input = request.body || {};  // ป้องกัน undefined
        console.log(input);

        await lineWebhook(input, request.log, { userRepo });

        return reply.status(200).send('OK');
    },

    lineExportReport: async (request: FastifyRequest, reply: FastifyReply) => {
        const input = request.body || {};
        console.log(input);

        await lineWebhook(input, request.log, { userRepo });

        return reply.status(200).send('OK');
    }
}
