export class BusinessSlugAlreadyInUseError extends Error {
  constructor(slug: string) {
    super(`Business slug "${slug}" is already in use`);
    this.name = "BusinessSlugAlreadyInUseError";
  }
}
