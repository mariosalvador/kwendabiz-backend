export class BusinessNotFoundError extends Error {
  constructor(id: string) {
    super(`Business "${id}" was not found`);
    this.name = "BusinessNotFoundError";
  }
}
