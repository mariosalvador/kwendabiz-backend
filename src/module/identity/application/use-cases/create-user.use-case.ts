import { User, type CreateUserProps } from "../../domain/entities/user.js";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";
import { UserSlugAlreadyInUseError } from "../errors/slug-already-in-use.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";

export type CreateUserInput = Omit<CreateUserProps, "id" | "createdAt" | "updatedAt">;

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.usersRepository.findByEmail(input.email);
    if (existingUser) {
      throw new EmailAlreadyInUseError(input.email);
    }
    const slug = createSlug(input.name);
    if (await this.usersRepository.findBySlug(slug)) {
      throw new UserSlugAlreadyInUseError(slug);
    }

    const user = User.create(input);
    await this.usersRepository.save(user);
    return user;
  }
}
