import { FastifyInstance } from 'fastify';
import { ShiftRequirementController } from '@service/interfaces/http/controllers/shiftRequirement.controller';
import { CreateShiftRequirementBody } from '@service/types/shiftRequirement.type';
import { createShiftRequirementSchema } from '@service/docs/shiftRequirement.schema';

export default async function shiftRequirementeRoutes(app: FastifyInstance) {
    app.post<{Body: CreateShiftRequirementBody}>(
        '/create/:shiftTemplateId',
        {
            attachValidation: true,
            schema: createShiftRequirementSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftRequirementController.create
    );
}