import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { Role } from "../enums/role.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export class UserRoles extends ValueObject<Role[]> {
  private constructor(roles: Role[]) {
    super(roles);
  }

  static create(raw: readonly Role[] | undefined): UserRoles {
    if (!raw || raw.length === 0) {
      throw UserValidationError.single("roles", "A user must have at least one role");
    }
    if (raw.some((role) => !Object.values(Role).includes(role))) {
      throw UserValidationError.single("roles", "All user roles must be valid");
    }
    if (new Set(raw).size !== raw.length) {
      throw UserValidationError.single("roles", "A user cannot have duplicate roles");
    }
    return new UserRoles([...raw]);
  }
}
