import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export class Email extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw UserValidationError.single("email", "A valid email is required");
    }
    return new Email(normalized);
  }
}
