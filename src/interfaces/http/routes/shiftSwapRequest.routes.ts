import { FastifyInstance } from 'fastify';
import { ShiftSwapRequestController } from '@service/interfaces/http/controllers/shiftSwapRequest.controller';
import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type';
import { createShiftSwapRequestSchema } from '@service/docs/shiftSwapRequest.schema';

export default async function shiftSwapRequestRoutes(app: FastifyInstance) {
    app.post<{Body: CreateShiftSwapRequestBody}>(
        '/create',
        {
            attachValidation: true,
            schema: createShiftSwapRequestSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftSwapRequestController.create
    );
}