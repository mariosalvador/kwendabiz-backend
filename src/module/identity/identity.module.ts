import { Module } from "@nestjs/common";

import { UsersController } from "./adapters/inbound/http/controllers/users.controller.js";
import { InMemoryUsersRepository } from "./adapters/outbound/persistence/in-memory/in-memory-users.repository.js";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case.js";
import { DeleteUserUseCase } from "./application/use-cases/delete-user.use-case.js";
import { GetUserUseCase } from "./application/use-cases/get-user.use-case.js";
import { ListUsersUseCase } from "./application/use-cases/list-users.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/update-user.use-case.js";
import { UsersRepository } from "./application/ports/repositories/users.repository.js";

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    GetUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    {
      provide: UsersRepository,
      useClass: InMemoryUsersRepository,
    },
  ],
})
export class IdentityModule { }