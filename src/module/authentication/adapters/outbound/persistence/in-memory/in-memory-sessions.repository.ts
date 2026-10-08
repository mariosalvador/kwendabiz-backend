import { Session } from "../../../../domain/entities/session.js";
import { SessionsRepository } from "../../../../application/ports/sessions.repository.js";

export class InMemorySessionsRepository implements SessionsRepository {
  private readonly sessions = new Map<string, Session>();

  findByRefreshTokenId(refreshTokenId: string): Promise<Session | null> {
    return Promise.resolve(this.sessions.get(refreshTokenId) ?? null);
  }

  save(session: Session): Promise<void> {
    this.sessions.set(session.refreshTokenId, session);
    return Promise.resolve();
  }
}
