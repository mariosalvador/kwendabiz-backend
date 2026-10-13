import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export class PhoneNumber extends ValueObject<string | undefined> {
  private constructor(value: string | undefined) {
    super(value);
  }

  static create(raw: string | undefined): PhoneNumber {
    if (raw === undefined) {
      return new PhoneNumber(undefined);
    }
    const normalized = raw.trim();
    if (normalized.length === 0) {
      throw UserValidationError.single("phone", "Phone cannot be empty");
    }
    return new PhoneNumber(normalized);
  }
}
