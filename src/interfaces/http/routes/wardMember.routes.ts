import { FastifyInstance } from 'fastify';
import { WardMemberController } from '@service/interfaces/http/controllers/wardMember.controller';
import { CreateWardMemberBody } from '@service/types/wardMember.type';
import { createWardMemberSchema } from '@service/docs/wardMember.schema';

export default async function wardMemberRoutes(app: FastifyInstance) {
    app.post<{Body: CreateWardMemberBody}>(
        '/create',
        {
            attachValidation: true,
            schema: createWardMemberSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardMemberController.create
    );
}