export class InvestmentForbiddenError extends Error {
  constructor() {
    super("Only users with the investor role can invest");
    this.name = "InvestmentForbiddenError";
  }
}
