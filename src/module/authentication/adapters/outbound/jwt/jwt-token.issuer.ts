import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "node:crypto";

import { TokenIssuer, type AuthenticatedUser, type IssuedTokens } from "../../../application/ports/token-issuer.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  async issue(user: AuthenticatedUser, sessionId: string): Promise<IssuedTokens> {
    const refreshTokenId = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, name: user.name, roles: user.roles, sid: sessionId, type: "access" },
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 86400000);
    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id, sid: sessionId, jti: refreshTokenId, type: "refresh" },
      { expiresIn: REFRESH_TOKEN_TTL },
    );
    return { accessToken, refreshToken, refreshTokenId, refreshTokenExpiresAt };
  }
}
