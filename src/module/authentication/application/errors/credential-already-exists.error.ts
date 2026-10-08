export class CredentialAlreadyExistsError extends Error {
  constructor(userId: string) {
    super(`Credentials already exist for user "${userId}"`);
    this.name = "CredentialAlreadyExistsError";
  }
}
