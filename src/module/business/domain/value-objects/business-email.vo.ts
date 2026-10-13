import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { BusinessValidationError } from "../errors/business-validation.error.js";

export class BusinessEmail extends ValueObject<string | undefined> {
  private constructor(value: string | undefined) {
    super(value);
  }

  static create(raw: string | undefined): BusinessEmail {
    if (raw === undefined) {
      return new BusinessEmail(undefined);
    }
    const normalized = raw.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      throw BusinessValidationError.single("email", "A valid email is required");
    }
    return new BusinessEmail(normalized);
  }
}
