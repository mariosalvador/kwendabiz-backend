import { ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";
import { AccountStatus } from "../../../../domain/enums/account-status.js";
import { Role } from "../../../../domain/enums/role.js";

export const updateUserSchema = z.object({
  email: z.string().trim().email("Invalid email address").optional(),
  name: z.string().trim().min(1, "Name is required").optional(),
  phone: z.string().trim().min(1, "Phone cannot be empty").optional(),
  roles: z.array(z.enum(Role)).min(1, "At least one role is required").optional(),
  status: z.enum(AccountStatus).optional(),
});

export class UpdateUserDto {
  static readonly schema = updateUserSchema;

  @ApiPropertyOptional({ example: "user@example.com" })
  email?: string;

  @ApiPropertyOptional({ example: "Maria Silva" })
  name?: string;

  @ApiPropertyOptional({ example: "+351 910 000 000" })
  phone?: string;

  @ApiPropertyOptional({ enum: Role, isArray: true })
  roles?: Role[];

  @ApiPropertyOptional({ enum: AccountStatus })
  status?: AccountStatus;
}
