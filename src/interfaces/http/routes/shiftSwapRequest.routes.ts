import { FastifyInstance } from 'fastify';
import { ShiftSwapRequestController } from '@service/interfaces/http/controllers/shiftSwapRequest.controller';
import { CreateShiftSwapRequestBody } from '@service/types/shiftSwapRequest.type';
import { createShiftSwapRequestSchema } from '@service/docs/shiftSwapRequest.schema';
import { getAllShiftSwapRequestForSchema } from '@service/docs/shiftSwapRequest.schema';
import { updateShiftAssignmentSchema } from '@service/docs/shiftAssignment.schema';
import { getUserShiftSwapsSchema } from '@service/docs/shiftSwapRequest.schema';

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

    app.patch(
        '/update/:shiftSwapRequestId',
        {
            attachValidation: true,
            schema: updateShiftAssignmentSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftSwapRequestController.update
    );

    app.get(
        '/getAllSwap/:wardId',
        {
            schema: getAllShiftSwapRequestForSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftSwapRequestController.getAllShiftSwapRequest
    );

    app.get(
        '/getUserSwap/:wardId',
        {
            schema: getUserShiftSwapsSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftSwapRequestController.getUserShiftSwap
    );
}