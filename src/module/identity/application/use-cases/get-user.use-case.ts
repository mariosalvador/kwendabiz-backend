import { User } from "../../domain/entities/user.js";
import { UserNotFoundError } from "../errors/user-not-found.error.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";

export class GetUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }

  async executeBySlug(slug: string): Promise<User> {
    const user = await this.usersRepository.findBySlug(slug);
    if (!user) {
      throw new UserNotFoundError(slug);
    }
    return user;
  }
}
