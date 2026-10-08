import { AccountStatus } from "../../../identity/domain/enums/account-status.js";
import { UsersRepository } from "../../../identity/application/ports/repositories/users.repository.js";
import { InvalidCredentialsError } from "../errors/invalid-credentials.error.js";
import { AccountNotActiveError } from "../errors/account-not-active.error.js";
import { CredentialsRepository } from "../ports/credentials.repository.js";
import { PasswordHasher } from "../ports/password-hasher.js";
import { SessionsRepository } from "../ports/sessions.repository.js";
import { TokenIssuer } from "../ports/token-issuer.js";
import { Session } from "../../domain/entities/session.js";
import { randomUUID } from "node:crypto";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: readonly string[];
  };
}

export class LoginUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly credentialsRepository: CredentialsRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.usersRepository.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsError();
    if (user.status !== AccountStatus.ACTIVE) throw new AccountNotActiveError();

    const credential = await this.credentialsRepository.findByUserId(user.id);
    if (!credential || !(await this.passwordHasher.compare(input.password, credential.passwordHash))) {
      throw new InvalidCredentialsError();
    }

    const sessionId = randomUUID();
    const tokens = await this.tokenIssuer.issue({
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
    }, sessionId);
    const session = Session.create(
      user.id,
      tokens.refreshTokenId,
      tokens.refreshTokenExpiresAt,
      sessionId,
    );
    await this.sessionsRepository.save(session);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: { id: user.id, email: user.email, name: user.name, roles: user.roles },
    };
  }
}
