import { FastifyInstance } from 'fastify';
import { WardMemberController } from '@service/interfaces/http/controllers/wardMember.controller';
import { CreateWardMemberBody } from '@service/types/wardMember.type';
import { createWardMemberSchema, getAllWardMemberInWardSchema } from '@service/docs/wardMember.schema';

export default async function wardMemberRoutes(app: FastifyInstance) {
    app.post<{Body: CreateWardMemberBody}>(
        '/create/:wardId',
        {
            attachValidation: true,
            schema: createWardMemberSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardMemberController.create
    );

    app.get(
        '/getAll/:wardId',
        {
            attachValidation: true,
            schema: getAllWardMemberInWardSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardMemberController.getAll
    );
}