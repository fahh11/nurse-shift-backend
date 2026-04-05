import { FastifyInstance } from 'fastify'
import healthRoutes from '@service/interfaces/http/routes/health.routes'
import userRoutes from '@service/interfaces/http/routes/user.routes'
import authRoutes from '@service/interfaces/http/routes/auth.routes'
import hospitalRoutes from '@service/interfaces/http/routes/hospital.routes'
import wardRoutes from '@service/interfaces/http/routes/ward.routes'
import wardMemberRoutes from '@service/interfaces/http/routes/wardMember.routes'
import shiftTemplateRoutes from '@service/interfaces/http/routes/shiftTemplate.routes'
import shiftRequirementeRoutes from '@service/interfaces/http/routes/shiftRequirement.routes'
import shiftAssignmentRoutes from '@service/interfaces/http/routes/shiftAssignment.routes'
import shiftSwapRequestRoutes from '@service/interfaces/http/routes/shiftSwapRequest.routes'
import lineRoutes from '@service/interfaces/http/routes/line.routes'

export const registerRoutes = (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: '/api/user' })
  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(hospitalRoutes, { prefix: '/api/hospital' })
  app.register(wardRoutes, { prefix: '/api/ward' })
  app.register(wardMemberRoutes, { prefix: '/api/ward-member' })
  app.register(shiftTemplateRoutes, { prefix: '/api/shift-template' })
  app.register(shiftRequirementeRoutes, { prefix: '/api/shift-requirement' })
  app.register(shiftAssignmentRoutes, { prefix: '/api/shift-assignment' })
  app.register(shiftSwapRequestRoutes, { prefix: '/api/shift-swap-request' })
  app.register(lineRoutes, { prefix: '/api/line' })

  app.register(healthRoutes, { prefix: '/api/health' })
}
