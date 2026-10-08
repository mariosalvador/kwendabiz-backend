export class BusinessForbiddenError extends Error {
  constructor() {
    super("You do not have permission to manage this business");
    this.name = "BusinessForbiddenError";
  }
}
