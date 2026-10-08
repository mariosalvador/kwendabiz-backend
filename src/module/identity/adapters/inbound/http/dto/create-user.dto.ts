import { Role } from "../../../../domain/enums/role.js";

export interface CreateUserDto {
  email: string;
  name: string;
  phone?: string;
  roles: Role[];
}
