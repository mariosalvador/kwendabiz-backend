import { User, type CreateUserProps } from "../../domain/entities/user.js";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";

export type CreateUserInput = Omit<CreateUserProps, "id" | "createdAt" | "updatedAt">;

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(input.email);
    }

    const user = User.create(input);
    await this.usersRepository.save(user);
    return user;
  }
}
