import { AccountStatus } from "../../../identity/domain/enums/account-status.js";
import { Role } from "../../../identity/domain/enums/role.js";
import { User } from "../../../identity/domain/entities/user.js";
import { EmailAlreadyInUseError } from "../../../identity/application/errors/email-already-in-use.error.js";
import { UsersRepository } from "../../../identity/application/ports/repositories/users.repository.js";
import { Credential } from "../../domain/entities/credential.js";
import { Verification } from "../../domain/entities/verification.js";
import { VerificationChannel } from "../../domain/enums/verification-channel.js";
import { CredentialAlreadyExistsError } from "../errors/credential-already-exists.error.js";
import { CredentialsRepository } from "../ports/credentials.repository.js";
import { PasswordHasher } from "../ports/password-hasher.js";
import { VerificationsRepository } from "../ports/verifications.repository.js";
import { randomBytes } from "node:crypto";

export interface RegisterInput {
  email: string;
  phone?: string;
  name: string;
  password: string;
  roles: readonly Role[];
  verificationChannel?: VerificationChannel;
}

export interface RegisterOutput {
  user: User;
  verificationToken: string;
}

export class RegisterUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly verificationsRepository: VerificationsRepository,
    private readonly passwordHasher: PasswordHasher,
  ) { }

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const user = User.create({
      email: input.email,
      phone: input.phone,
      name: input.name,
      roles: input.roles,
      status: AccountStatus.PENDING,
    });

    const existingCredential = await this.credentialsRepository.findByUserId(user.id);

    if (existingCredential) {
      throw new CredentialAlreadyExistsError(user.id);
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const credential = Credential.create(user.id, passwordHash);
    const channel = input.verificationChannel ?? (
      user.phone ? VerificationChannel.Phone : VerificationChannel.Email
    );
    const token = randomBytes(32).toString("hex");
    const verification = Verification.create(
      user.id,
      channel,
      token,
      new Date(Date.now() + 15 * 60 * 1000),
    );

    await this.usersRepository.save(user);
    await this.credentialsRepository.save(credential);
    await this.verificationsRepository.save(verification);

    return { user, verificationToken: token };
  }
}
