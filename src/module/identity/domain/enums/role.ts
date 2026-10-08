import { Permission } from "./permission.js";

export enum Role {
  Admin = "admin",
  User = "user",
}

export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.Admin]: [
    Permission.ManageUsers,
    Permission.ReadUsers,
    Permission.ManageRoles,
  ],
  [Role.User]: [Permission.ReadUsers],
};
