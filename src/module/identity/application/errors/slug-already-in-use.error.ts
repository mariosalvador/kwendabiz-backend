export class UserSlugAlreadyInUseError extends Error {
  constructor(slug: string) {
    super(`User slug "${slug}" is already in use`);
    this.name = "UserSlugAlreadyInUseError";
  }
}
