import { FastifyInstance } from 'fastify'
import healthRoute from '@service/interfaces/http/routes/health.routes'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(healthRoute, { prefix: '/api/health' })
}
