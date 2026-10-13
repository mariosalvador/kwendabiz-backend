import { randomUUID } from "node:crypto";

import { BusinessValidationError } from "../errors/business-validation.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";
import { BankDetailsValue } from "../value-objects/bank-details.vo.js";
import { BusinessEmail } from "../value-objects/business-email.vo.js";
import { BusinessLinkValue } from "../value-objects/business-link.vo.js";

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
      email: BusinessEmail.create(input.email).value,
      links: validateLinks(input.links ?? []),
      logo: optionalText(input.logo),
      bankDetails: input.bankDetails
        ? BankDetailsValue.create(input.bankDetails).value
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
    if (input.email !== undefined) this.props.email = BusinessEmail.create(input.email).value;
    if (input.links !== undefined) this.props.links = validateLinks(input.links);
    if (input.logo !== undefined) this.props.logo = optionalText(input.logo);
    if (input.bankDetails !== undefined) {
      this.props.bankDetails = input.bankDetails
        ? BankDetailsValue.create(input.bankDetails).value
        : undefined;
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
  if (!normalized) throw BusinessValidationError.single(field, `${field} is required`);
  return normalized;
}

function optionalText(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const normalized = value.trim();
  return normalized || undefined;
}

function validateLinks(links: readonly BusinessLink[]): BusinessLink[] {
  return links.map((link) => BusinessLinkValue.create(link.name, link.url).value);
}
