import 'fastify';
import { JwtPayload } from '@service/types/auth.type';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>;

    requireCompletedProfile(
      request: FastifyRequest,
      reply: FastifyReply
    ): Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}
