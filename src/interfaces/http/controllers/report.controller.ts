import { FastifyRequest, FastifyReply } from 'fastify';
import { exportReport } from '@service/use-cases/report/exportReport';
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

export const ReportController = {
    export: async (request: FastifyRequest, reply: FastifyReply) => {
        const currentUser = request.user

        const { wardId } = request.params as { wardId: string }
        const { year, month } = request.query as { year: number, month: number }

        const result = await exportReport(
            reply,
            currentUser.userId,
            wardId,
            Number(month),
            Number(year),
            request.log,
            {shiftAssignmentRepo, shiftTemplateRepo, shiftRequirementRepo, userRepo, wardRepo}
        );
    },
}