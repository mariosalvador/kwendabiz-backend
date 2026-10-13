import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { InvestmentValidationError } from "../errors/investment-validation.error.js";

export class InvestmentAmount extends ValueObject<number> {
  private constructor(value: number) {
    super(value);
  }

  static create(amount: number): InvestmentAmount {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw InvestmentValidationError.single(
        "amount",
        "Investment amount must be greater than zero",
      );
    }
    return new InvestmentAmount(amount);
  }
}
