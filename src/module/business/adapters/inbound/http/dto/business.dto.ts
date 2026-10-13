import { PartialType, ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { z } from "zod";
import type { BankDetails, BusinessLink } from "../../../../domain/entities/business.js";

export const businessLinkSchema = z.object({
  name: z.string().trim().min(1, "Link name is required"),
  url: z.string().trim().url("Link url must be a valid URL"),
});

export const bankDetailsSchema = z.object({
  bankName: z.string().trim().min(1, "Bank name is required"),
  iban: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s/g, "").toUpperCase())
    .refine(
      (val) => /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(val),
      "A valid IBAN is required",
    ),
});

export const createBusinessSchema = z.object({
  name: z.string().trim().min(1, "Business name is required"),
  category: z.string().trim().min(1, "Category is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  email: z.string().trim().email("Invalid email").optional(),
  links: z.array(businessLinkSchema).optional(),
  logo: z.string().trim().optional(),
  bankDetails: bankDetailsSchema.optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export class BusinessLinkDto implements BusinessLink {
  static readonly schema = businessLinkSchema;

  @ApiProperty({ example: "Website" })
  name: string;
  @ApiProperty({ example: "https://example.com" })
  url: string;
}

export class BankDetailsDto implements BankDetails {
  static readonly schema = bankDetailsSchema;

  @ApiProperty({ example: "Kwenda Bank" })
  bankName: string;
  @ApiProperty({ example: "PT50000201231234567890154" })
  iban: string;
}

export class CreateBusinessDto {
  static readonly schema = createBusinessSchema;

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

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {
  static readonly schema = updateBusinessSchema;
}
