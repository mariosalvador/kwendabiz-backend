import { randomUUID } from "node:crypto";

export interface SessionProps {
  id: string;
  userId: string;
  refreshTokenId: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
}

export class Session {
  private constructor(private readonly props: SessionProps) {}

  static create(
    userId: string,
    refreshTokenId: string,
    expiresAt: Date,
    id = randomUUID(),
  ): Session {
    return new Session({
      id,
      userId,
      refreshTokenId,
      createdAt: new Date(),
      expiresAt: new Date(expiresAt),
    });
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get refreshTokenId(): string { return this.props.refreshTokenId; }
  get expiresAt(): Date { return new Date(this.props.expiresAt); }

  isActive(now = new Date()): boolean {
    return !this.props.revokedAt && this.props.expiresAt > now;
  }

  revoke(): void {
    this.props.revokedAt = new Date();
  }
}
