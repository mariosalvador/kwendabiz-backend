import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export class UserName extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(raw: string): UserName {
    const normalized = raw.trim();
    if (normalized.length === 0) {
      throw UserValidationError.single("name", "A name is required");
    }
    return new UserName(normalized);
  }
}
