import { PartialType, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import type { BankDetails, BusinessLink } from "../../../../domain/entities/business.js";

export class BusinessLinkDto implements BusinessLink {
  @ApiProperty({ example: "Website" })
  name: string;
  @ApiProperty({ example: "https://example.com" })
  url: string;
}

export class BankDetailsDto implements BankDetails {
  @ApiProperty({ example: "Kwenda Bank" })
  bankName: string;
  @ApiProperty({ example: "PT50000201231234567890154" })
  iban: string;
}

export class CreateBusinessDto {
  @ApiProperty({ example: "Kwenda Tech" })
  name: string;
  @ApiProperty({ example: "Technology" })
  category: string;
  @ApiProperty({ example: "+351 910 000 000" })
  phone: string;
  @ApiPropertyOptional({ example: "contact@example.com" })
  email?: string;
  @ApiPropertyOptional({ type: BusinessLinkDto, isArray: true })
  links?: BusinessLinkDto[];
  @ApiPropertyOptional({ example: "https://cdn.example.com/logo.png" })
  logo?: string;
  @ApiPropertyOptional({ type: BankDetailsDto })
  bankDetails?: BankDetailsDto;
}

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
