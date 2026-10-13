import { describe, expect, it } from "vitest";
import { InvestmentAmount } from "../../../../../src/module/investment/domain/value-objects/investment-amount.vo.js";
import { InvestmentValidationError } from "../../../../../src/module/investment/domain/errors/investment-validation.error.js";

describe("InvestmentAmount Value Object", () => {
  it("creates valid amount", () => {
    const amount = InvestmentAmount.create(100.5);
    expect(amount.value).toBe(100.5);
  });

  it("throws error for zero, negative or NaN amount", () => {
    expect(() => InvestmentAmount.create(0)).toThrow(
      "Investment amount must be greater than zero",
    );
    expect(() => InvestmentAmount.create(-50)).toThrow(InvestmentValidationError);
    expect(() => InvestmentAmount.create(Number.NaN)).toThrow(InvestmentValidationError);
  });
});
