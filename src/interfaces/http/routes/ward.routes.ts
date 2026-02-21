import { FastifyInstance } from 'fastify'
import { WardController } from '@service/interfaces/http/controllers/ward.controller';
import { CreateWardBody, UpdateWardBody } from '@service/types/ward.type';
import { createWardSchema, 
        updateWardSchema,
        getAllWardInHospitalSchema,
        getWardByIdSchema 
    } from '@service/docs/ward.schema';

export default async function wardRoutes(app: FastifyInstance) {
    app.post<{Body: CreateWardBody}>(
        '/create',
        {
            attachValidation: true,
            schema: createWardSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardController.create
    );

    app.patch<{Body: UpdateWardBody}>(
        '/update',
        {
            attachValidation: true,
            schema: updateWardSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardController.update
    );

    app.get(
        '/getAllWardInHospital',
        {
            attachValidation: true,
            schema: getAllWardInHospitalSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardController.getAllWardInHospital
    );

    app.get(
        '/getWardById/:wardId',
        {
            attachValidation: true,
            schema: getWardByIdSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        WardController.getWardById
    );
}