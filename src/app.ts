import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { registerRoutes } from '@service/interfaces/http/routes';
import { FastifyRequest, FastifyReply } from 'fastify';
import { throwCustomError, ErrorDescription } from '@service/helpers/error';
import { StatusCode } from '@service/enums/statusCode';
import '@service/types/fastify';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // 🔐 Register JWT plugin BEFORE routes
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
  });

  // ✅ Middleware: Authenticate & Check Profile Completion
  app.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      await request.jwtVerify();
    }
  );


  // ✅ ทุก user ต้อง profile complete
  app.decorate(
    "requireCompletedProfile",
    async function (request: FastifyRequest, reply: FastifyReply) {
      if (!request.user.profileComplete) {
        throwCustomError(
          ErrorDescription.PROFILE_NOT_COMPLETED,
          StatusCode.FORBIDDEN_403
        )
      }
    }
  );


  // 🚦 Register routes
  registerRoutes(app);

  return app;
}
