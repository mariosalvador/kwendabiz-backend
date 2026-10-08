import type { Role } from "../../../identity/domain/enums/role.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  roles: readonly Role[];
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenId: string;
  refreshTokenExpiresAt: Date;
}

export abstract class TokenIssuer {
  abstract issue(user: AuthenticatedUser, sessionId: string): Promise<IssuedTokens>;
}
