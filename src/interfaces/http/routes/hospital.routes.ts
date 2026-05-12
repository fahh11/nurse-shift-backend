import { FastifyInstance } from 'fastify'
import { CreateHospitalBody } from '@service/types/hospital.type';
import { UpdateHospitalBody } from '@service/types/hospital.type';
import { HospitalController } from '@service/interfaces/http/controllers/hospital.controller';
import { createHospitalSchema } from '@service/docs/hospital.schema';
import { updateHospitalSchema } from '@service/docs/hospital.schema';
import { getAllHospitalSchema, getUserHospitalSchema } from '@service/docs/hospital.schema';

export default async function hospitalRoutes(app: FastifyInstance) {
    app.post<{Body: CreateHospitalBody}>(
        '/create',
        {
            attachValidation: true,
            schema: createHospitalSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        HospitalController.create
    );

    app.patch<{Body: UpdateHospitalBody}>(
        '/update',
        {
            attachValidation: true,
            schema: updateHospitalSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        HospitalController.update
    );

    app.get(
        '/getAllHospital',
        {
            attachValidation: true,
            schema: getAllHospitalSchema,
            preHandler: [app.authenticate] 
        },
        HospitalController.getAllHospital
    );

    app.get(
        '/getUserHospital',
        {
            attachValidation: true,
            schema: getUserHospitalSchema,
            preHandler: [app.authenticate] 
        },
        HospitalController.getUserHospital
    );
}