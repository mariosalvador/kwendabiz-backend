import { User } from "../../../../domain/entities/user.js";
import { UsersRepository } from "../../../../application/ports/repositories/users.repository.js";

export class InMemoryUsersRepository implements UsersRepository {
  private readonly users = new Map<string, User>();

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.get(id) ?? null);
  }

  findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return Promise.resolve(
      [...this.users.values()].find((user) => user.email === normalizedEmail) ?? null,
    );
  }

  findAll(): Promise<User[]> {
    return Promise.resolve([...this.users.values()]);
  }

  save(user: User): Promise<void> {
    this.users.set(user.id, user);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.users.delete(id);
    return Promise.resolve();
  }
}
