import { FastifyInstance } from 'fastify'
import { JwtService } from '@service/domain/ports/jwtService'
import { JwtPayload } from '@service/types/auth.type'

export class JwtServiceImpl implements JwtService {
  constructor(private readonly app: FastifyInstance) {}

  sign(payload: JwtPayload): string {
    return this.app.jwt.sign(payload, { expiresIn: '1h' })
  }

  verify(token: string): JwtPayload {
    return this.app.jwt.verify<JwtPayload>(token)
  }
}
