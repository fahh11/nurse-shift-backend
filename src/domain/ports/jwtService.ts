import { JwtPayload } from "@service/types/auth.type"

export interface JwtService {
  sign(payload: JwtPayload): string
  verify<T>(token: string): JwtPayload
}
