import { Injectable } from "@nestjs/common";
import type { Role } from "../../../../../identity/domain/enums/role.js";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  roles: Role[];
  sid: string;
  type: "access" | "refresh";
}

@Injectable()
export class JwtStrategy {
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      roles: payload.roles,
    };
  }
}
