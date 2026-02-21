import { FastifyInstance } from 'fastify'
import { CreateHospitalBody } from '@service/types/hospital.type';
import { UpdateHospitalBody } from '@service/types/hospital.type';
import { HospitalController } from '@service/interfaces/http/controllers/hospital.controller';
import { createHospitalSchema } from '@service/docs/hospital.schema';
import { updateHospitalSchema } from '@service/docs/hospital.schema';

export default async function hospitalRoutes(app: FastifyInstance) {
    app.post<{Body: CreateHospitalBody}>(
        '/create',
        {
            schema: createHospitalSchema,
        },
        HospitalController.create
    );

    app.patch<{Body: UpdateHospitalBody}>(
        '/update',
        {
            schema: updateHospitalSchema,
        },
        HospitalController.update
    );
}