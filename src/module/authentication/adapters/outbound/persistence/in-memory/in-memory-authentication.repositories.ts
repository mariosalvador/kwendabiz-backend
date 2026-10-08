import { Credential } from "../../../../domain/entities/credential.js";
import { Verification } from "../../../../domain/entities/verification.js";
import { CredentialsRepository } from "../../../../application/ports/credentials.repository.js";
import { VerificationsRepository } from "../../../../application/ports/verifications.repository.js";

export class InMemoryCredentialsRepository implements CredentialsRepository {
  private readonly credentials = new Map<string, Credential>();

  findByUserId(userId: string): Promise<Credential | null> {
    return Promise.resolve(this.credentials.get(userId) ?? null);
  }

  save(credential: Credential): Promise<void> {
    this.credentials.set(credential.userId, credential);
    return Promise.resolve();
  }
}

export class InMemoryVerificationsRepository implements VerificationsRepository {
  private readonly verifications = new Map<string, Verification>();

  findByToken(token: string): Promise<Verification | null> {
    return Promise.resolve(this.verifications.get(token) ?? null);
  }

  save(verification: Verification): Promise<void> {
    this.verifications.set(verification.token, verification);
    return Promise.resolve();
  }
}
