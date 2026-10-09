import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../../../../identity/domain/enums/role.js";
import { VerificationChannel } from "../../../../domain/enums/verification-channel.js";

export class RegisterDto {
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
