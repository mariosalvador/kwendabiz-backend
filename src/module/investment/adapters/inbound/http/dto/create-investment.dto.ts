import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const createInvestmentSchema = z.object({
  businessId: z.string().trim().min(1, "Business ID is required"),
  amount: z.number().positive("Investment amount must be greater than zero"),
});

export class CreateInvestmentDto {
  static readonly schema = createInvestmentSchema;

  @ApiProperty({ example: "business-id" })
  businessId: string;
  @ApiProperty({ example: 1000, minimum: 0, exclusiveMinimum: true })
  amount: number;
}
