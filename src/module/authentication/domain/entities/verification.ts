import { randomUUID } from "node:crypto";

import { VerificationChannel } from "../enums/verification-channel.js";

export interface VerificationProps {
  id: string;
  userId: string;
  channel: VerificationChannel;
  token: string;
  expiresAt: Date;
  verifiedAt?: Date;
}

export class Verification {
  private constructor(private readonly props: VerificationProps) {}

  static create(
    userId: string,
    channel: VerificationChannel,
    token: string,
    expiresAt: Date,
  ): Verification {
    return new Verification({
      id: randomUUID(),
      userId,
      channel,
      token,
      expiresAt: new Date(expiresAt),
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get channel(): VerificationChannel {
    return this.props.channel;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return new Date(this.props.expiresAt);
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt ? new Date(this.props.verifiedAt) : undefined;
  }

  isExpired(now = new Date()): boolean {
    return this.props.expiresAt.getTime() <= now.getTime();
  }

  verify(now = new Date()): void {
    this.props.verifiedAt = new Date(now);
  }
}
