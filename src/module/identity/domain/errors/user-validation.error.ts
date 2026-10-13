import {
  DomainValidationError,
  type ValidationErrorDetail,
} from "../../../../shared/core/errors/domain-validation.error.js";

export class UserValidationError extends DomainValidationError {
  constructor(message: string, errors: ValidationErrorDetail[] = []) {
    super(message, errors);
    this.name = "UserValidationError";
  }

  static override single(field: string, message: string, code?: string): UserValidationError {
    return new UserValidationError(message, [{ field, message, code }]);
  }
}
