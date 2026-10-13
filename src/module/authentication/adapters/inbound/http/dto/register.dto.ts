import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";
import { Role } from "../../../../../identity/domain/enums/role.js";
import { VerificationChannel } from "../../../../domain/enums/verification-channel.js";

export const registerSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(1, "Phone cannot be empty").optional(),
  name: z.string().trim().min(1, "Name is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  roles: z.array(z.enum(Role)).min(1, "At least one role is required"),
  verificationChannel: z.enum(VerificationChannel).optional(),
});

export class RegisterDto {
  static readonly schema = registerSchema;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiPropertyOptional({ example: "+351 910 000 000" })
  phone?: string;

  @ApiProperty({ example: "Maria Silva" })
  name: string;

  @ApiProperty({ example: "StrongPassword123!" })
  password: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.Client] })
  roles: Role[];

  @ApiPropertyOptional({ enum: VerificationChannel })
  verificationChannel?: VerificationChannel;
}
