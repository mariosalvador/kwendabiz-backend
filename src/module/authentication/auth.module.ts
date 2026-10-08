import { Module } from "@nestjs/common";

import { IdentityModule } from "../identity/identity.module.js";
import { AuthenticationController } from "./adapters/inbound/http/controllers/authentication.controller.js";
import { BcryptPasswordHasher } from "./adapters/outbound/cryptography/bcrypt-password.hasher.js";
import {
  InMemoryCredentialsRepository,
  InMemoryVerificationsRepository,
} from "./adapters/outbound/persistence/in-memory/in-memory-authentication.repositories.js";
import { CredentialsRepository } from "./application/ports/credentials.repository.js";
import { PasswordHasher } from "./application/ports/password-hasher.js";
import { VerificationsRepository } from "./application/ports/verifications.repository.js";
import { RegisterUseCase } from "./application/use-cases/register.use-case.js";
import { VerifyContactUseCase } from "./application/use-cases/verify-contact.use-case.js";

@Module({
  imports: [IdentityModule],
  controllers: [AuthenticationController],
  providers: [
    RegisterUseCase,
    VerifyContactUseCase,
    {
      provide: CredentialsRepository,
      useClass: InMemoryCredentialsRepository,
    },
    {
      provide: VerificationsRepository,
      useClass: InMemoryVerificationsRepository,
    },
    {
      provide: PasswordHasher,
      useClass: BcryptPasswordHasher,
    },
  ],
})
export class AuthenticationModule {}