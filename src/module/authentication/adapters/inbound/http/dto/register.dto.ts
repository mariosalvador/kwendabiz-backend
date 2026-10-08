import { Role } from "../../../../../identity/domain/enums/role.js";
import { VerificationChannel } from "../../../../domain/enums/verification-channel.js";

export interface RegisterDto {
  email: string;
  phone?: string;
  name: string;
  password: string;
  roles: Role[];
  verificationChannel?: VerificationChannel;
}
