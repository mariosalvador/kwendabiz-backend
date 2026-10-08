export class InvestmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvestmentValidationError";
  }
}
