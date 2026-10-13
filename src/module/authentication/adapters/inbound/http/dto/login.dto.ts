import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export class LoginDto {
  static readonly schema = loginSchema;

  @ApiProperty({ example: "user@example.com" })
  email: string;

  @ApiProperty({ example: "StrongPassword123!" })
  password: string;
}
