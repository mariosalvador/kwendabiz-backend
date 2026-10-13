import { describe, expect, it } from "vitest";
import { Email } from "../../../../../src/module/identity/domain/value-objects/email.vo.js";
import { UserValidationError } from "../../../../../src/module/identity/domain/errors/user-validation.error.js";

describe("Email Value Object", () => {
  it("normalizes email to lowercase and trims whitespace", () => {
    const email = Email.create("  USER@EXAMPLE.COM  ");
    expect(email.value).toBe("user@example.com");
  });

  it("throws UserValidationError for invalid email format", () => {
    expect(() => Email.create("invalid-email")).toThrow(UserValidationError);
    expect(() => Email.create("")).toThrow("A valid email is required");
  });
});
