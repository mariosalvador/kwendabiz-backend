import { AccountStatus } from "../../../../../src/module/identity/domain/enums/account-status.js";
import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { InMemoryUsersRepository } from "../../../../../src/module/identity/adapters/outbound/persistence/in-memory/in-memory-users.repository.js";
import { InMemoryCredentialsRepository, InMemoryVerificationsRepository } from "../../../../../src/module/authentication/adapters/outbound/persistence/in-memory/in-memory-authentication.repositories.js";
import { PasswordHasher } from "../../../../../src/module/authentication/application/ports/password-hasher.js";
import { RegisterUseCase } from "../../../../../src/module/authentication/application/use-cases/register.use-case.js";
import { VerifyContactUseCase } from "../../../../../src/module/authentication/application/use-cases/verify-contact.use-case.js";
import { InvalidVerificationTokenError } from "../../../../../src/module/authentication/application/errors/invalid-verification-token.error.js";

class FakePasswordHasher extends PasswordHasher {
  hash(password: string): Promise<string> {
    return Promise.resolve(`hashed:${password}`);
  }

  compare(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe("RegisterUseCase", () => {
  it("creates a pending user, credential and verification token", async () => {
    const users = new InMemoryUsersRepository();
    const credentials = new InMemoryCredentialsRepository();
    const verifications = new InMemoryVerificationsRepository();
    const register = new RegisterUseCase(users, credentials, verifications, new FakePasswordHasher());

    const result = await register.execute({
      email: "user@example.com",
      name: "User",
      password: "password123",
      roles: [Role.Client],
    });

    expect(result.user.status).toBe(AccountStatus.PENDING);
    expect(result.verificationToken).toHaveLength(64);
    expect(await credentials.findByUserId(result.user.id)).not.toBeNull();
    expect(await verifications.findByToken(result.verificationToken)).not.toBeNull();
  });

  it("activates the account only after a valid contact verification", async () => {
    const users = new InMemoryUsersRepository();
    const credentials = new InMemoryCredentialsRepository();
    const verifications = new InMemoryVerificationsRepository();
    const register = new RegisterUseCase(users, credentials, verifications, new FakePasswordHasher());
    const verifyContact = new VerifyContactUseCase(users, verifications);
    const { user, verificationToken } = await register.execute({
      email: "user@example.com",
      name: "User",
      password: "password123",
      roles: [Role.Client],
    });

    expect(user.status).toBe(AccountStatus.PENDING);
    await verifyContact.execute(verificationToken);
    expect((await users.findById(user.id))?.status).toBe(AccountStatus.ACTIVE);
    await expect(verifyContact.execute(verificationToken)).rejects.toThrow(
      InvalidVerificationTokenError,
    );
  });
});
