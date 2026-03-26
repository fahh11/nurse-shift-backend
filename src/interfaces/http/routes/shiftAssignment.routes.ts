import { FastifyInstance } from 'fastify';
import { ShiftAssignmentController } from '@service/interfaces/http/controllers/shiftAssignment.controller';
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type';
import { createShiftAssignmentSchema } from '@service/docs/shiftAssignment.schema';

export default async function shiftAssignmentRoutes(app: FastifyInstance) {
    app.post<{Body: CreateShiftAssignmentBody}>(
        '/create/:wardId',
        {
            attachValidation: true,
            schema: createShiftAssignmentSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftAssignmentController.create
    );
}