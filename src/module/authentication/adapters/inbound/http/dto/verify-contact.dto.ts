import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const verifyContactSchema = z.object({
  token: z.string().trim().min(1, "Verification token is required"),
});

export class VerifyContactDto {
  static readonly schema = verifyContactSchema;

  @ApiProperty({ example: "verification-token" })
  token: string;
}
