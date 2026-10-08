import { AccountStatus } from "../../../../../src/module/identity/domain/enums/account-status.js";
import { Permission } from "../../../../../src/module/identity/domain/enums/permission.js";
import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { User } from "../../../../../src/module/identity/domain/entities/user.js";
import { UserValidationError } from "../../../../../src/module/identity/domain/errors/user-validation.error.js";

describe("User", () => {
  it("creates a normalized user with a default role and active account", () => {
    const user = User.create({
      email: "  USER@Example.COM ",
      name: "  Mario Salvador ",
      phone: " +351 900 000 000 ",
      roles: [Role.Client],
    });

    expect(user.email).toBe("user@example.com");
    expect(user.name).toBe("Mario Salvador");
    expect(user.slug).toBe("mario-salvador");
    expect(user.phone).toBe("+351 900 000 000");
    expect(user.roles).toEqual([Role.Client]);
    expect(user.status).toBe(AccountStatus.ACTIVE);
  });

  it("updates the slug when the name changes", () => {
    const user = User.create({
      email: "user@example.com",
      name: "Old Name",
      roles: [Role.Client],
    });

    user.changeName("New Name");

    expect(user.slug).toBe("new-name");
  });

  it.each([
    { email: "invalid", name: "User" },
    { email: "user@example.com", name: " " },
    { email: "user@example.com", name: "User", roles: [] },
  ])("rejects invalid user data: %o", (input) => {
    expect(() => User.create(input)).toThrow(UserValidationError);
  });

  it("manages roles and evaluates their permissions", () => {
    const user = User.create({
      email: "user@example.com",
      name: "User",
      roles: [Role.Client],
    });

    expect(user.can(Permission.ManageUsers)).toBe(false);
    user.assignRole(Role.Admin);
    expect(user.hasRole(Role.Admin)).toBe(true);
    expect(user.can(Permission.ManageUsers)).toBe(true);

    user.removeRole(Role.Admin);
    expect(user.roles).toEqual([Role.Client]);
    expect(() => user.removeRole(Role.Client)).toThrow(UserValidationError);
  });

  it("changes account status through domain operations", () => {
    const user = User.create({
      email: "user@example.com",
      name: "User",
      roles: [Role.Client],
    });

    user.suspend();
    expect(user.status).toBe(AccountStatus.SUSPENDED);
    user.deactivate();
    expect(user.status).toBe(AccountStatus.INACTIVE);
    user.activate();
    expect(user.status).toBe(AccountStatus.ACTIVE);
  });
});
