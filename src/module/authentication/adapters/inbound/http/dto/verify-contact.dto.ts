import { ApiProperty } from "@nestjs/swagger";

export class VerifyContactDto {
  @ApiProperty({ example: "verification-token" })
  token: string;
}
