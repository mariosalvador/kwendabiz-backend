import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export class UserId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(raw: string): UserId {
    const normalized = raw.trim();
    if (normalized.length === 0) {
      throw UserValidationError.single("id", "A user id is required");
    }
    return new UserId(normalized);
  }
}
