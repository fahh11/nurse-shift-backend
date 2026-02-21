import { FastifyInstance } from 'fastify'
import { UpdateUserForCompleteProfileBody, UpdateUserBody } from '@service/types/user.type';
import { updateUserForCompleteProfileSchema, updateUserSchema } from '@service/docs/user.schema';
import { UserController } from '@service/interfaces/http/controllers/user.controller';

export default async function userRoutes(app: FastifyInstance) {
    app.patch<{Body: UpdateUserForCompleteProfileBody}>(
        '/updateForCompleteProfile',
        {
            schema: updateUserForCompleteProfileSchema,
            // preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        UserController.updateForCompleteProfile
    );

    app.patch<{Body: UpdateUserBody}>(
        '/update',
        {
            schema: updateUserSchema,
            // preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        UserController.update
    );
}