import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";

import { IdentityModule } from "../identity/identity.module.js";
import { AuthenticationController } from "./adapters/inbound/http/controllers/authentication.controller.js";
import { JwtAuthGuard } from "./adapters/inbound/http/guards/jwt-auth.guard.js";
import { JwtStrategy } from "./adapters/inbound/http/strategies/jwt.strategy.js";
import { BcryptPasswordHasher } from "./adapters/outbound/cryptography/bcrypt-password.hasher.js";
import { JwtTokenIssuer } from "./adapters/outbound/jwt/jwt-token.issuer.js";
import {
  InMemoryCredentialsRepository,
  InMemoryVerificationsRepository,
} from "./adapters/outbound/persistence/in-memory/in-memory-authentication.repositories.js";
import { InMemorySessionsRepository } from "./adapters/outbound/persistence/in-memory/in-memory-sessions.repository.js";
import { CredentialsRepository } from "./application/ports/credentials.repository.js";
import { PasswordHasher } from "./application/ports/password-hasher.js";
import { VerificationsRepository } from "./application/ports/verifications.repository.js";
import { SessionsRepository } from "./application/ports/sessions.repository.js";
import { TokenIssuer } from "./application/ports/token-issuer.js";
import { LoginUseCase } from "./application/use-cases/login.use-case.js";
import { RegisterUseCase } from "./application/use-cases/register.use-case.js";
import { VerifyContactUseCase } from "./application/use-cases/verify-contact.use-case.js";
import { env } from "../../config/env.js";

@Module({
  imports: [
    IdentityModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    RegisterUseCase,
    VerifyContactUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtTokenIssuer,
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
    {
      provide: SessionsRepository,
      useClass: InMemorySessionsRepository,
    },
    {
      provide: TokenIssuer,
      useExisting: JwtTokenIssuer,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthenticationModule { }