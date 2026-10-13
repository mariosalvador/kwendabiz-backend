import { describe, expect, it } from "vitest";
import { Iban } from "../../../../../src/module/business/domain/value-objects/iban.vo.js";
import { BusinessValidationError } from "../../../../../src/module/business/domain/errors/business-validation.error.js";

describe("Iban Value Object", () => {
  it("sanitizes spaces and normalizes uppercase", () => {
    const iban = Iban.create("pt50 0000 1234 5678 9012 3456 7");
    expect(iban.value).toBe("PT50000012345678901234567");
  });

  it("throws error for invalid IBAN format", () => {
    expect(() => Iban.create("INVALID_IBAN")).toThrow(BusinessValidationError);
    expect(() => Iban.create("")).toThrow("IBAN is required");
  });
});
