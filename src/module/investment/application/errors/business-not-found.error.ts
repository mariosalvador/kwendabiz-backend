export class InvestmentBusinessNotFoundError extends Error {
  constructor(id: string) {
    super(`Business "${id}" was not found`);
    this.name = "InvestmentBusinessNotFoundError";
  }
}
