import { ApiProperty } from "@nestjs/swagger";

export class CreateInvestmentDto {
  @ApiProperty({ example: "business-id" })
  businessId: string;
  @ApiProperty({ example: 1000, minimum: 0, exclusiveMinimum: true })
  amount: number;
}
