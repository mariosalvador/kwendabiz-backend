import { AccountStatus } from "../../../../../src/module/identity/domain/enums/account-status.js";
import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { User } from "../../../../../src/module/identity/domain/entities/user.js";
import { InMemoryUsersRepository } from "../../../../../src/module/identity/adapters/outbound/persistence/in-memory/in-memory-users.repository.js";
import { Credential } from "../../../../../src/module/authentication/domain/entities/credential.js";
import { InMemoryCredentialsRepository } from "../../../../../src/module/authentication/adapters/outbound/persistence/in-memory/in-memory-authentication.repositories.js";
import { InMemorySessionsRepository } from "../../../../../src/module/authentication/adapters/outbound/persistence/in-memory/in-memory-sessions.repository.js";
import { PasswordHasher } from "../../../../../src/module/authentication/application/ports/password-hasher.js";
import { TokenIssuer, type AuthenticatedUser, type IssuedTokens } from "../../../../../src/module/authentication/application/ports/token-issuer.js";
import { LoginUseCase } from "../../../../../src/module/authentication/application/use-cases/login.use-case.js";

class FakePasswordHasher extends PasswordHasher {
  hash(): Promise<string> {
    return Promise.resolve("hashed-password");
  }

  compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(password === "password123" && hash === "hashed-password");
  }
}

class FakeTokenIssuer extends TokenIssuer {
  issue(_user: AuthenticatedUser, _sessionId: string): Promise<IssuedTokens> {
    return Promise.resolve({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      refreshTokenId: "refresh-token-id",
      refreshTokenExpiresAt: new Date(Date.now() + 86_400_000),
    });
  }
}

describe("LoginUseCase", () => {
  it("validates credentials, creates a session and returns public user data with tokens", async () => {
    const user = User.create({
      email: "user@example.com",
      name: "User",
      roles: [Role.Client],
      status: AccountStatus.ACTIVE,
    });
    const users = new InMemoryUsersRepository();
    const credentials = new InMemoryCredentialsRepository();
    await users.save(user);
    await credentials.save(Credential.create(user.id, "hashed-password"));

    const login = new LoginUseCase(
      users,
      credentials,
      new InMemorySessionsRepository(),
      new FakePasswordHasher(),
      new FakeTokenIssuer(),
    );
    const result = await login.execute({
      email: "USER@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: [Role.Client],
      },
    });
  });
});
