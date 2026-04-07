import { FastifyInstance } from 'fastify'
import { LineController } from '@service/interfaces/http/controllers/line.controller';

export default async function lineRoutes(app: FastifyInstance) {
    app.patch(
        '/connect',
        { 
            preHandler: [app.authenticate]
        },
        LineController.lineConnect
    );

    // webhook จาก LINE (ห้าม require auth)
    app.post(
        '/webhook',
        LineController.lineWebhook
    );

    // webhook จาก LINE (ห้าม require auth)
    app.post(
        '/export',
        LineController.lineExportReport
    );
}