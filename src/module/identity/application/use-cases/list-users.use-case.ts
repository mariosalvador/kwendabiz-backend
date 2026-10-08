import { User } from "../../domain/entities/user.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";

export class ListUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  execute(): Promise<User[]> {
    return this.usersRepository.findAll();
  }
}
