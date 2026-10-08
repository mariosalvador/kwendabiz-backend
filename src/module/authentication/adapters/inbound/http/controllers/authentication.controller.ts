import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
  Post,
} from "@nestjs/common";

import { EmailAlreadyInUseError } from "../../../../../identity/application/errors/email-already-in-use.error.js";
import { UserValidationError } from "../../../../../identity/domain/errors/user-validation.error.js";
import { AccountNotActiveError } from "../../../../application/errors/account-not-active.error.js";
import { InvalidCredentialsError } from "../../../../application/errors/invalid-credentials.error.js";
import { InvalidVerificationTokenError } from "../../../../application/errors/invalid-verification-token.error.js";
import { LoginUseCase } from "../../../../application/use-cases/login.use-case.js";
import { RegisterUseCase } from "../../../../application/use-cases/register.use-case.js";
import { VerifyContactUseCase } from "../../../../application/use-cases/verify-contact.use-case.js";
import { Public } from "../decorators/public.decorator.js";
import { CurrentUser as CurrentUserDecorator } from "../decorators/current-user.decorator.js";
import type { CurrentUser } from "../decorators/current-user.decorator.js";
import type { RegisterDto } from "../dto/register.dto.js";
import type { VerifyContactDto } from "../dto/verify-contact.dto.js";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly verifyContact: VerifyContactUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post("register")
  @Public()
  async registerUser(@Body() body: RegisterDto) {
    try {
      const result = await this.register.execute(body);
      return {
        user: result.user.toJSON(),
        verificationToken: result.verificationToken,
      };
    } catch (error) {
      throw mapAuthenticationError(error);
    }
  }

  @Post("verify")
  @Public()
  @HttpCode(204)
  async verify(@Body() body: VerifyContactDto): Promise<void> {
    try {
      await this.verifyContact.execute(body.token);
    } catch (error) {
      throw mapAuthenticationError(error);
    }
  }

  @Post("login")
  @Public()
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.loginUseCase.execute(body);
    } catch (error) {
      throw mapAuthenticationError(error);
    }
  }

  @Get("me")
  me(@CurrentUserDecorator() user: CurrentUser): CurrentUser {
    return user;
  }
}

function mapAuthenticationError(error: unknown): Error {
  if (error instanceof EmailAlreadyInUseError) {
    return new ConflictException(error instanceof Error ? error.message : "Email already in use");
  }
  if (error instanceof UserValidationError || error instanceof InvalidVerificationTokenError) {
    return new BadRequestException(error instanceof Error ? error.message : "Invalid request");
  }
  if (error instanceof InvalidCredentialsError || error instanceof AccountNotActiveError) {
    return new UnauthorizedException(error instanceof Error ? error.message : "Invalid credentials");
  }
  return error instanceof Error ? error : new Error("Unexpected authentication error");
}
