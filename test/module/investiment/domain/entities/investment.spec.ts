import { Investment } from "../../../../../src/module/investiment/domain/entities/investment.js";
import { InvestmentValidationError } from "../../../../../src/module/investiment/domain/errors/investment-validation.error.js";

describe("Investment", () => {
  it("creates an investment with valid references and amount", () => {
    const investment = Investment.create({
      businessId: "business-1",
      investorId: "investor-1",
      amount: 1500,
    });

    expect(investment.toJSON()).toMatchObject({
      businessId: "business-1",
      investorId: "investor-1",
      amount: 1500,
    });
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid amount %s",
    (amount) => {
      expect(() =>
        Investment.create({
          businessId: "business-1",
          investorId: "investor-1",
          amount,
        }),
      ).toThrow(InvestmentValidationError);
    },
  );
});
