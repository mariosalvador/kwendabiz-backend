import { randomUUID } from "node:crypto";

import { BusinessValidationError } from "../errors/business-validation.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";

export interface BusinessLink {
  name: string;
  url: string;
}

export interface BankDetails {
  bankName: string;
  iban: string;
}

export interface BusinessProps {
  id: string;
  slug: string;
  ownerId: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  links: BusinessLink[];
  logo?: string;
  bankDetails?: BankDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessProps {
  ownerId: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  links?: readonly BusinessLink[];
  logo?: string;
  bankDetails?: BankDetails;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Business {
  private constructor(private readonly props: BusinessProps) {}

  static create(input: CreateBusinessProps): Business {
    const now = new Date();
    const name = requiredText(input.name, "name");
    return new Business({
      id: input.id ?? randomUUID(),
      slug: createSlug(name),
      ownerId: requiredText(input.ownerId, "ownerId"),
      name,
      category: requiredText(input.category, "category"),
      phone: requiredText(input.phone, "phone"),
      email: input.email === undefined ? undefined : normalizeEmail(input.email),
      links: validateLinks(input.links ?? []),
      logo: optionalText(input.logo),
      bankDetails: input.bankDetails
        ? validateBankDetails(input.bankDetails)
        : undefined,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    });
  }

  get id(): string { return this.props.id; }
  get ownerId(): string { return this.props.ownerId; }
  get slug(): string { return this.props.slug; }
  get name(): string { return this.props.name; }
  get category(): string { return this.props.category; }
  get phone(): string { return this.props.phone; }
  get email(): string | undefined { return this.props.email; }
  get links(): readonly BusinessLink[] { return this.props.links.map((link) => ({ ...link })); }
  get logo(): string | undefined { return this.props.logo; }
  get bankDetails(): BankDetails | undefined {
    return this.props.bankDetails ? { ...this.props.bankDetails } : undefined;
  }
  get createdAt(): Date { return new Date(this.props.createdAt); }
  get updatedAt(): Date { return new Date(this.props.updatedAt); }

  update(input: Partial<Omit<CreateBusinessProps, "ownerId" | "id" | "createdAt" | "updatedAt">>): void {
    if (input.name !== undefined) {
      this.props.name = requiredText(input.name, "name");
      this.props.slug = createSlug(this.props.name);
    }
    if (input.category !== undefined) this.props.category = requiredText(input.category, "category");
    if (input.phone !== undefined) this.props.phone = requiredText(input.phone, "phone");
    if (input.email !== undefined) this.props.email = normalizeEmail(input.email);
    if (input.links !== undefined) this.props.links = validateLinks(input.links);
    if (input.logo !== undefined) this.props.logo = optionalText(input.logo);
    if (input.bankDetails !== undefined) {
      this.props.bankDetails = validateBankDetails(input.bankDetails);
    }
    this.props.updatedAt = new Date();
  }

  toJSON(): BusinessProps {
    return {
      ...this.props,
      links: [...this.links],
      bankDetails: this.bankDetails,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

function requiredText(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new BusinessValidationError(`${field} is required`);
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  return normalized || undefined;
}

function normalizeEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new BusinessValidationError("A valid email is required");
  }
  return normalized;
}

function validateLinks(links: readonly BusinessLink[]): BusinessLink[] {
  return links.map((link) => {
    const name = requiredText(link.name, "link name");
    const url = requiredText(link.url, "link url");
    try {
      new URL(url);
    } catch {
      throw new BusinessValidationError("Link url must be a valid URL");
    }
    return { name, url };
  });
}

function validateBankDetails(bankDetails: BankDetails): BankDetails {
  const bankName = requiredText(bankDetails.bankName, "bank name");
  const iban = requiredText(bankDetails.iban, "IBAN").replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) {
    throw new BusinessValidationError("A valid IBAN is required");
  }
  return { bankName, iban };
}
