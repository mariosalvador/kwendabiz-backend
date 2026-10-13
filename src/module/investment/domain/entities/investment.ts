import { randomUUID } from "node:crypto";

import { InvestmentValidationError } from "../errors/investment-validation.error.js";
import { InvestmentAmount } from "../value-objects/investment-amount.vo.js";

export interface InvestmentProps {
  id: string;
  businessId: string;
  investorId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvestmentProps {
  businessId: string;
  investorId: string;
  amount: number;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Investment {
  private constructor(private readonly props: InvestmentProps) {}

  static create(input: CreateInvestmentProps): Investment {
    const now = new Date();
    return new Investment({
      id: input.id ?? randomUUID(),
      businessId: requiredId(input.businessId, "businessId"),
      investorId: requiredId(input.investorId, "investorId"),
      amount: InvestmentAmount.create(input.amount).value,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get businessId(): string {
    return this.props.businessId;
  }

  get investorId(): string {
    return this.props.investorId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get createdAt(): Date {
    return new Date(this.props.createdAt);
  }

  get updatedAt(): Date {
    return new Date(this.props.updatedAt);
  }

  toJSON(): InvestmentProps {
    return {
      ...this.props,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

function requiredId(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw InvestmentValidationError.single(field, `${field} is required`);
  }
  return normalized;
}
