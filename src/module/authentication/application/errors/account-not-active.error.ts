export class AccountNotActiveError extends Error {
  constructor() {
    super("Account must be verified before login");
    this.name = "AccountNotActiveError";
  }
}
