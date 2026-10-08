import bcrypt from "bcrypt";

import { PasswordHasher } from "../../../application/ports/password-hasher.js";

const BCRYPT_ROUNDS = 12;

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    validatePassword(password);
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    validatePassword(password);
    return bcrypt.compare(password, hash);
  }
}

function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters");
  }
}
