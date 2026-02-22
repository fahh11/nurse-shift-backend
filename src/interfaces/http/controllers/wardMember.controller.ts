import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateWardMemberBody } from '@service/types/wardMember.type'
import { createWardMember } from '@service/use-cases/ward-member/createWardMember'
import { PrismaWardMemberRepository } from '@service/infrastructure/persistence/prisma/repositories/wardMember.repository.impl'
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl'
import { PrismaWardRepository } from '@service/infrastructure/persistence/prisma/repositories/ward.repository.impl'

const wardMemberRepo = new PrismaWardMemberRepository()
const userRepo = new PrismaUserRepository()
const wardRepo = new PrismaWardRepository()

export const WardMemberController = {
    create: async (request: FastifyRequest<{Body: CreateWardMemberBody}>, reply: FastifyReply) => {
        const input = request.body
        const currentUser = request.user

        const result = await createWardMember(
            input,
            currentUser.userId,
            request.log,
            {wardMemberRepo, userRepo, wardRepo}
        );
        return reply.send(result);
    },
}