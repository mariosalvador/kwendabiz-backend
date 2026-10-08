import { randomUUID } from "node:crypto";
import { AccountStatus } from "../enums/account-status.js";
import { Permission } from "../enums/permission.js";
import { rolePermissions, Role } from "../enums/role.js";
import { UserValidationError } from "../errors/user-validation.error.js";

export interface UserProps {
  id: string;
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
  roles?: readonly Role[];
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
    const roles = input.roles ?? [Role.User];

    return new User({
      id: validateId(input.id ?? randomUUID()),
      email: normalizeEmail(input.email),
      phone: normalizePhone(input.phone),
      name: normalizeName(input.name),
      status: input.status ?? AccountStatus.ACTIVE,
      roles: validateRoles(roles),
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
    this.props.name = normalizeName(name);
    this.touch();
  }

  changeEmail(email: string): void {
    this.props.email = normalizeEmail(email);
    this.touch();
  }

  setPhone(phone: string): void {
    this.props.phone = normalizePhone(phone);
    this.touch();
  }

  replaceRoles(roles: readonly Role[]): void {
    this.props.roles = validateRoles(roles);
    this.touch();
  }

  assignRole(role: Role): void {
    if (!Object.values(Role).includes(role)) {
      throw new UserValidationError(`Invalid role: ${role}`);
    }
    if (!this.props.roles.includes(role)) {
      this.props.roles = [...this.props.roles, role];
      this.touch();
    }
  }

  removeRole(role: Role): void {
    if (this.props.roles.length === 1 && this.props.roles.includes(role)) {
      throw new UserValidationError("A user must have at least one role");
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

function normalizeEmail(email: string): string {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new UserValidationError("A valid email is required");
  }
  return normalizedEmail;
}

function validateId(id: string): string {
  const normalizedId = id.trim();
  if (normalizedId.length === 0) {
    throw new UserValidationError("A user id is required");
  }
  return normalizedId;
}

function normalizeName(name: string): string {
  const normalizedName = name.trim();
  if (normalizedName.length === 0) {
    throw new UserValidationError("A name is required");
  }
  return normalizedName;
}

function normalizePhone(phone: string | undefined): string | undefined {
  if (phone === undefined) {
    return undefined;
  }
  const normalizedPhone = phone.trim();
  if (normalizedPhone.length === 0) {
    throw new UserValidationError("Phone cannot be empty");
  }
  return normalizedPhone;
}

function validateRoles(roles: readonly Role[]): Role[] {
  if (roles.length === 0) {
    throw new UserValidationError("A user must have at least one role");
  }
  if (roles.some((role) => !Object.values(Role).includes(role))) {
    throw new UserValidationError("All user roles must be valid");
  }
  if (new Set(roles).size !== roles.length) {
    throw new UserValidationError("A user cannot have duplicate roles");
  }
  return [...roles];
}
