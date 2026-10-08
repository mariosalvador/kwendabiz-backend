import { AccountStatus } from "../../domain/enums/account-status.js";
import { Role } from "../../domain/enums/role.js";
import { User } from "../../domain/entities/user.js";
import { EmailAlreadyInUseError } from "../errors/email-already-in-use.error.js";
import { UserNotFoundError } from "../errors/user-not-found.error.js";
import { UsersRepository } from "../ports/repositories/users.repository.js";
import { UserSlugAlreadyInUseError } from "../errors/slug-already-in-use.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";

export interface UpdateUserInput {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  roles?: readonly Role[];
  status?: AccountStatus;
}

export class UpdateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.usersRepository.findById(input.id);
    if (!user) {
      throw new UserNotFoundError(input.id);
    }

    if (input.email !== undefined && input.email.trim().toLowerCase() !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(input.email);
      if (existingUser && existingUser.id !== user.id) {
        throw new EmailAlreadyInUseError(input.email);
      }
      user.changeEmail(input.email);
    }
    if (input.name !== undefined) {
      const slug = createSlug(input.name);
      const existingUser = await this.usersRepository.findBySlug(slug);
      if (existingUser && existingUser.id !== user.id) {
        throw new UserSlugAlreadyInUseError(slug);
      }
      user.changeName(input.name);
    }
    if (input.phone !== undefined) {
      user.setPhone(input.phone);
    }
    if (input.roles !== undefined) {
      user.replaceRoles(input.roles);
    }
    if (input.status !== undefined) {
      setStatus(user, input.status);
    }

    await this.usersRepository.save(user);
    return user;
  }
}

function setStatus(user: User, status: AccountStatus): void {
  switch (status) {
    case AccountStatus.ACTIVE:
      user.activate();
      break;
    case AccountStatus.INACTIVE:
      user.deactivate();
      break;
    case AccountStatus.SUSPENDED:
      user.suspend();
      break;
    case AccountStatus.PENDING:
      user.markPending();
      break;
    default:
      throw new Error("Unsupported account status");
  }
}
