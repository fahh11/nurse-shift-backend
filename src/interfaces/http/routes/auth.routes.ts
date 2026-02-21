import { FastifyInstance } from 'fastify'
import { CreateGoogleAuthBody } from '@service/types/auth.type';
import { AuthController } from '@service/interfaces/http/controllers/auth.controller';

export default async function authRoutes(app: FastifyInstance) {
    app.post<{Body: CreateGoogleAuthBody}>(
        '/google',
        AuthController.googleLogin
    );

    app.get(
        "/me",
        { 
            attachValidation: true,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        AuthController.getMe
    );

}