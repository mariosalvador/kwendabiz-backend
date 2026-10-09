import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Role } from "../../../../domain/enums/role.js";

export class CreateUserDto {
  @ApiProperty({ example: "user@example.com" })
  email: string;
  @ApiProperty({ example: "Maria Silva" })
  name: string;
  @ApiPropertyOptional({ example: "+351 910 000 000" })
  phone?: string;
  @ApiProperty({ enum: Role, isArray: true, example: [Role.Client] })
  roles: Role[];
}
