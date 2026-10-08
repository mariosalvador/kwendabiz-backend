import { AccountStatus } from "../../../../domain/enums/account-status.js";
import { Role } from "../../../../domain/enums/role.js";

export interface UpdateUserDto {
  email?: string;
  name?: string;
  phone?: string;
  roles?: Role[];
  status?: AccountStatus;
}
