import { Verification } from "../../domain/entities/verification.js";

export abstract class VerificationsRepository {
  abstract findByToken(token: string): Promise<Verification | null>;
  abstract save(verification: Verification): Promise<void>;
}
