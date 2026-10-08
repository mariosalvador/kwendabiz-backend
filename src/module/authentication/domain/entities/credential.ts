import { randomUUID } from "node:crypto";

export interface CredentialProps {
  id: string;
  userId: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Credential {
  private constructor(private readonly props: CredentialProps) {}

  static create(userId: string, passwordHash: string): Credential {
    const now = new Date();
    return new Credential({
      id: randomUUID(),
      userId,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }
}
