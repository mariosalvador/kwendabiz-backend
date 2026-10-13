import { randomUUID } from "node:crypto";
import { AccountStatus } from "../enums/account-status.js";
import { Permission } from "../enums/permission.js";
import { rolePermissions, Role } from "../enums/role.js";
import { UserValidationError } from "../errors/user-validation.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";
import { Email } from "../value-objects/email.vo.js";
import { PhoneNumber } from "../value-objects/phone.vo.js";
import { UserId } from "../value-objects/user-id.vo.js";
import { UserName } from "../value-objects/user-name.vo.js";
import { UserRoles } from "../value-objects/user-roles.vo.js";

export interface UserProps {
  id: string;
  slug: string;
  email: string;
  phone?: string;
  name: string;
  status: AccountStatus;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserProps {
  email: string;
  name: string;
  phone?: string;
  roles: readonly Role[];
  status?: AccountStatus;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = {
      ...props,
      roles: [...props.roles],
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
  }

  static create(input: CreateUserProps): User {
    const now = new Date();
    const id = UserId.create(input.id ?? randomUUID()).value;
    const name = UserName.create(input.name).value;
    const email = Email.create(input.email).value;
    const phone = PhoneNumber.create(input.phone).value;
    const roles = UserRoles.create(input.roles).value;

    return new User({
      id,
      slug: createSlug(name),
      email,
      phone,
      name,
      status: input.status ?? AccountStatus.ACTIVE,
      roles,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get slug(): string {
    return this.props.slug;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): AccountStatus {
    return this.props.status;
  }

  get roles(): readonly Role[] {
    return [...this.props.roles];
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  changeName(name: string): void {
    this.props.name = UserName.create(name).value;
    this.props.slug = createSlug(this.props.name);
    this.touch();
  }

  changeEmail(email: string): void {
    this.props.email = Email.create(email).value;
    this.touch();
  }

  setPhone(phone: string): void {
    this.props.phone = PhoneNumber.create(phone).value;
    this.touch();
  }

  replaceRoles(roles: readonly Role[]): void {
    this.props.roles = UserRoles.create(roles).value;
    this.touch();
  }

  assignRole(role: Role): void {
    if (!Object.values(Role).includes(role)) {
      throw UserValidationError.single("role", `Invalid role: ${role}`);
    }
    if (!this.props.roles.includes(role)) {
      this.props.roles = [...this.props.roles, role];
      this.touch();
    }
  }

  removeRole(role: Role): void {
    if (this.props.roles.length === 1 && this.props.roles.includes(role)) {
      throw UserValidationError.single("role", "A user must have at least one role");
    }
    this.props.roles = this.props.roles.filter((currentRole) => currentRole !== role);
    this.touch();
  }

  hasRole(role: Role): boolean {
    return this.props.roles.includes(role);
  }

  can(permission: Permission): boolean {
    return this.props.roles.some((role) => rolePermissions[role].includes(permission));
  }

  activate(): void {
    this.props.status = AccountStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    this.props.status = AccountStatus.INACTIVE;
    this.touch();
  }

  suspend(): void {
    this.props.status = AccountStatus.SUSPENDED;
    this.touch();
  }

  markPending(): void {
    this.props.status = AccountStatus.PENDING;
    this.touch();
  }

  toJSON(): UserProps {
    return {
      ...this.props,
      roles: [...this.props.roles],
      createdAt: new Date(this.props.createdAt),
      updatedAt: new Date(this.props.updatedAt),
    };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
