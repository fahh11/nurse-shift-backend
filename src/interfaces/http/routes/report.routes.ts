import { FastifyInstance } from 'fastify';
import { ReportController } from '@service/interfaces/http/controllers/report.controller';
import { exportReportSchema } from '@service/docs/report.schema';

export default async function reportRoutes(app: FastifyInstance) {
    app.post(
        '/export/:wardId',
        {
            attachValidation: true,
            schema: exportReportSchema,
            preHandler: [app.authenticate, app.requireCompletedProfile] 
        },
        ReportController.export
    );
}