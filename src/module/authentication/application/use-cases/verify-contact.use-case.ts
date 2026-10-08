import { UsersRepository } from "../../../identity/application/ports/repositories/users.repository.js";
import { InvalidVerificationTokenError } from "../errors/invalid-verification-token.error.js";
import { VerificationsRepository } from "../ports/verifications.repository.js";

export class VerifyContactUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly verificationsRepository: VerificationsRepository,
  ) {}

  async execute(token: string): Promise<void> {
    const verification = await this.verificationsRepository.findByToken(token);
    if (!verification || verification.verifiedAt || verification.isExpired()) {
      throw new InvalidVerificationTokenError();
    }

    const user = await this.usersRepository.findById(verification.userId);
    if (!user) {
      throw new InvalidVerificationTokenError();
    }

    verification.verify();
    user.activate();
    await this.verificationsRepository.save(verification);
    await this.usersRepository.save(user);
  }
}
