import { describe, expect, it } from "vitest";
import { PhoneNumber } from "../../../../../src/module/identity/domain/value-objects/phone.vo.js";
import { UserValidationError } from "../../../../../src/module/identity/domain/errors/user-validation.error.js";

describe("PhoneNumber Value Object", () => {
  it("trims phone and returns valid value", () => {
    const phone = PhoneNumber.create("  +351 910 000 000  ");
    expect(phone.value).toBe("+351 910 000 000");
  });

  it("allows undefined", () => {
    const phone = PhoneNumber.create(undefined);
    expect(phone.value).toBeUndefined();
  });

  it("throws UserValidationError when phone is empty string", () => {
    expect(() => PhoneNumber.create("   ")).toThrow(UserValidationError);
    expect(() => PhoneNumber.create("")).toThrow("Phone cannot be empty");
  });
});
