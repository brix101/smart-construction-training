import { JwtPayload } from 'jwt-decode'

export type SessionJwtPayload = JwtPayload & {
  sub?: string
}
