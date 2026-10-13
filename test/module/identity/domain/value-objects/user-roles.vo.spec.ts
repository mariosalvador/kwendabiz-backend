import { describe, expect, it } from "vitest";
import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { UserRoles } from "../../../../../src/module/identity/domain/value-objects/user-roles.vo.js";
import { UserValidationError } from "../../../../../src/module/identity/domain/errors/user-validation.error.js";

describe("UserRoles Value Object", () => {
  it("creates valid roles array", () => {
    const roles = UserRoles.create([Role.Client, Role.Investor]);
    expect(roles.value).toEqual([Role.Client, Role.Investor]);
  });

  it("throws error when roles array is empty or undefined", () => {
    expect(() => UserRoles.create([])).toThrow("A user must have at least one role");
    expect(() => UserRoles.create(undefined)).toThrow(UserValidationError);
  });

  it("throws error on duplicates", () => {
    expect(() => UserRoles.create([Role.Client, Role.Client])).toThrow(
      "A user cannot have duplicate roles",
    );
  });
});
