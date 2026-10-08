import { Permission } from "./permission.js";

export enum Role {
  Client = "client",
  Investor = "investor",
  Entrepreneur = "entrepreneur",
  Admin = "admin",
}

export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = {
  [Role.Client]: [Permission.ReadUsers],
  [Role.Investor]: [Permission.ReadUsers],
  [Role.Entrepreneur]: [Permission.ReadUsers],
  [Role.Admin]: [
    Permission.ManageUsers,
    Permission.ReadUsers,
    Permission.ManageRoles,
  ],
};
