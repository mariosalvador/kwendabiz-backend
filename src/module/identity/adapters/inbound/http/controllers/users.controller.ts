import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { UserValidationError } from "../../../../domain/errors/user-validation.error.js";
import { EmailAlreadyInUseError } from "../../../../application/errors/email-already-in-use.error.js";
import { UserNotFoundError } from "../../../../application/errors/user-not-found.error.js";
import { UserSlugAlreadyInUseError } from "../../../../application/errors/slug-already-in-use.error.js";
import { CreateUserUseCase } from "../../../../application/use-cases/create-user.use-case.js";
import { DeleteUserUseCase } from "../../../../application/use-cases/delete-user.use-case.js";
import { GetUserUseCase } from "../../../../application/use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "../../../../application/use-cases/list-users.use-case.js";
import { UpdateUserUseCase } from "../../../../application/use-cases/update-user.use-case.js";
import type { CreateUserDto } from "../dto/create-user.dto.js";
import type { UpdateUserDto } from "../dto/update-user.dto.js";

@Controller("users")
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUser: GetUserUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) { }

  @Post()
  async create(@Body() body: CreateUserDto) {
    try {
      return (await this.createUser.execute(body)).toJSON();
    } catch (error) {
      throw mapError(error);
    }
  }

  @Get()
  async list() {
    return (await this.listUsers.execute()).map((user) => user.toJSON());
  }

  @Get(":id")
  async get(@Param("id") id: string) {
    try {
      return (await this.getUser.execute(id)).toJSON();
    } catch (error) {
      throw mapError(error);
    }
  }

  @Get("slug/:slug")
  async getBySlug(@Param("slug") slug: string) {
    try {
      return (await this.getUser.executeBySlug(slug)).toJSON();
    } catch (error) {
      throw mapError(error);
    }
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: UpdateUserDto) {
    try {
      return (await this.updateUser.execute({ id, ...body })).toJSON();
    } catch (error) {
      throw mapError(error);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(@Param("id") id: string): Promise<void> {
    try {
      await this.deleteUser.execute(id);
    } catch (error) {
      throw mapError(error);
    }
  }
}

function mapError(error: unknown): Error {
  if (error instanceof UserNotFoundError) {
    return new NotFoundException(error instanceof Error ? error.message : "User not found");
  }
  if (error instanceof EmailAlreadyInUseError) {
    return new ConflictException(error instanceof Error ? error.message : "Email already in use");
  }
  if (error instanceof UserSlugAlreadyInUseError) {
    return new ConflictException(error.message);
  }
  if (error instanceof UserValidationError) {
    return new ConflictException(error instanceof Error ? error.message : "Invalid user data");
  }
  return error instanceof Error ? error : new Error("Unexpected identity error");
}
