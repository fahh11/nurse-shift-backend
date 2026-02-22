import { FastifyInstance } from 'fastify'
import { googleCreateUserSchema } from '@service/docs/auth.schema';
import { CreateGoogleAuthBody } from '@service/types/auth.type';
import { AuthController } from '@service/interfaces/http/controllers/auth.controller';

export default async function authRoutes(app: FastifyInstance) {
    app.get(
        '/google',
        { 
            attachValidation: true,
            schema: googleCreateUserSchema,
        },
        AuthController.googleLogin
    );

    app.get(
        "/me",
        { 
            attachValidation: true,
            preHandler: [app.authenticate] 
        },
        AuthController.getMe
    );

    app.post(
        "/logout",
        {
            preHandler: [app.authenticate],
        }, 
        AuthController.logout
    );
}