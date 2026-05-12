import { FastifyInstance } from 'fastify';
import { ShiftTemplateController } from '@service/interfaces/http/controllers/shiftTemplate.controller';
import { CreateShiftTemplateBody, UpdateShiftTemplateBody } from '@service/types/shiftTemplate.type';
import { createShiftTemplateSchema, updateShiftTemplateSchema, getAllShiftTemplateInWardSchema } from '@service/docs/shiftTemplate.schema';

export default async function shiftTemplateRoutes(app: FastifyInstance) {
    app.post<{Body: CreateShiftTemplateBody[]}>(
        '/create',
        {
            attachValidation: true,
            schema: createShiftTemplateSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftTemplateController.create
    );

    app.patch<{Body: UpdateShiftTemplateBody}>(
        '/update/:shiftTemplateId',
        {
            attachValidation: true,
            schema: updateShiftTemplateSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftTemplateController.update
    );

    app.get(
        '/getAllShiftTemplateInWard/:wardId',
        {
            schema: getAllShiftTemplateInWardSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ShiftTemplateController.getAllShiftTemplateInWard
    );
}