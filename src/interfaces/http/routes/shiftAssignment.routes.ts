import { FastifyInstance } from 'fastify';
import { ShiftAssignmentController } from '@service/interfaces/http/controllers/shiftAssignment.controller';
import { CreateShiftAssignmentBody } from '@service/types/shiftAssignment.type';
import { createShiftAssignmentSchema } from '@service/docs/shiftAssignment.schema';
import { summaryMonthShiftAssignmentSchema } from '@service/docs/shiftAssignment.schema';
import { getShiftAssignmentforCreateSwapSchema } from '@service/docs/shiftAssignment.schema';
import { deleteShiftAssignmentSchema } from '@service/docs/shiftAssignment.schema';

export default async function shiftAssignmentRoutes(app: FastifyInstance) {
    app.post<{Body: CreateShiftAssignmentBody[]}>(
        '/create/:wardId',
        {
            attachValidation: true,
            schema: createShiftAssignmentSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftAssignmentController.create
    );

    app.get(
        '/getSummary/:wardId',
        {
            schema: summaryMonthShiftAssignmentSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftAssignmentController.getSummaryMonthShiftAssignment
    );

    app.get(
        '/getForSwap/:wardId',
        {
            schema: getShiftAssignmentforCreateSwapSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftAssignmentController.getShiftAssignmentForCreateSwap
    );

    app.patch(
        '/delete/:shiftAssignmentId',
        {
            schema: deleteShiftAssignmentSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftAssignmentController.delete
    )
}