import { UserNotFoundError } from "../errors/user-not-found.error.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";

export class DeleteUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    await this.usersRepository.delete(id);
  }
}
