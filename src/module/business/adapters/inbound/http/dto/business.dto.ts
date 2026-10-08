import type { BankDetails, BusinessLink } from "../../../../domain/entities/business.js";

export interface CreateBusinessDto {
  name: string;
  category: string;
  phone: string;
  email?: string;
  links?: BusinessLink[];
  logo?: string;
  bankDetails?: BankDetails;
}

export type UpdateBusinessDto = Partial<CreateBusinessDto>;
