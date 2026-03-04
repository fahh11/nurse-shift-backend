import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from '@fastify/cors';
import { env } from '@service/config/env';
import { registerRoutes } from '@service/interfaces/http/routes';
import { FastifyRequest, FastifyReply } from 'fastify';
import { throwCustomError, ErrorDescription } from '@service/helpers/error';
import { StatusCode } from '@service/enums/statusCode';
import '@service/types/fastify';
import { PrismaUserRepository } from '@service/infrastructure/persistence/prisma/repositories/user.repository.impl';

const userRepo = new PrismaUserRepository();

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // ✅ เพิ่มตรงนี้เลย
  app.register(cors, {
    origin: `${env.frontEnd.redirectUrl}`,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
      const user = await userRepo.findById(request.user.userId);

      if (!user?.profileCompleted) {
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
