import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";
import { Role } from "../../../../domain/enums/role.js";

export const createUserSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  name: z.string().trim().min(1, "Name is required"),
  phone: z.string().trim().min(1, "Phone cannot be empty").optional(),
  roles: z.array(z.enum(Role)).min(1, "At least one role is required"),
});

export class CreateUserDto {
  static readonly schema = createUserSchema;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "Maria Silva" })
  name: string;

  @ApiPropertyOptional({ example: "+351 910 000 000" })
  phone?: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.Client] })
  roles: Role[];
}
