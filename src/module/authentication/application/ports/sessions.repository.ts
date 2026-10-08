import { Session } from "../../domain/entities/session.js";

export abstract class SessionsRepository {
  abstract findByRefreshTokenId(refreshTokenId: string): Promise<Session | null>;
  abstract save(session: Session): Promise<void>;
}
