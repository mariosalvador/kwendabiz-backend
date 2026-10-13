import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { BusinessValidationError } from "../errors/business-validation.error.js";

export class Iban extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(raw: string): Iban {
    const trimmed = raw.trim();
    if (!trimmed) {
      throw BusinessValidationError.single("iban", "IBAN is required");
    }
    const normalized = trimmed.replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(normalized)) {
      throw BusinessValidationError.single("iban", "A valid IBAN is required");
    }
    return new Iban(normalized);
  }
}
