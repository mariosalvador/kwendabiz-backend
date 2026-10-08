import { Credential } from "../../domain/entities/credential.js";

export abstract class CredentialsRepository {
  abstract findByUserId(userId: string): Promise<Credential | null>;
  abstract save(credential: Credential): Promise<void>;
}
