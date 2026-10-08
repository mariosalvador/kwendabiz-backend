import { User } from "../../../domain/entities/user.js";

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findBySlug(slug: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract save(user: User): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
