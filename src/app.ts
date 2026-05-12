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

  // 🚩 ดักจับ CustomError เพื่อให้ยอมส่ง field 'details' ออกไปหน้าบ้าน
  app.setErrorHandler((error: any, request, reply) => {
    if (error.statusCode && error.details) {
      return reply.status(error.statusCode).send({
        message: error.message,
        statusCode: error.statusCode,
        code: error.errors?.[0]?.code,
        details: error.details // <--- ตัวแปรส่งให้หน้าบ้าน
      });
    }
    return reply.send(error); // Error อื่นๆ ให้ Fastify จัดการตามปกติ
  });

  // แก้ Fastify ให้รับ empty body หรือ raw JSON
  app.addContentTypeParser(
    'application/json',
    { parseAs: 'string' },
    function (req, body, done) {
      try {
        // ถ้า body เป็น Buffer ให้แปลงเป็น string
        const strBody = typeof body === 'string' ? body : body.toString('utf8');

        const json = strBody ? JSON.parse(strBody) : {};
        done(null, json); // err ต้องเป็น null
      } catch (err) {
        done(err as Error, undefined); // cast err เป็น Error
      }
    }
  );

  // 🚦 Register routes
  registerRoutes(app);

  return app;
}
