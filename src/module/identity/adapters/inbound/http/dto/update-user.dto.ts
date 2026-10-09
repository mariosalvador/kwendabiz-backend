import { ApiPropertyOptional } from "@nestjs/swagger";
import { AccountStatus } from "../../../../domain/enums/account-status.js";
import { Role } from "../../../../domain/enums/role.js";

export class UpdateUserDto {
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
