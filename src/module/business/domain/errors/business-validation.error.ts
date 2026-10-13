import {
  DomainValidationError,
  type ValidationErrorDetail,
} from "../../../../shared/core/errors/domain-validation.error.js";

export class BusinessValidationError extends DomainValidationError {
  constructor(message: string, errors: ValidationErrorDetail[] = []) {
    super(message, errors);
    this.name = "BusinessValidationError";
  }

  static override single(field: string, message: string, code?: string): BusinessValidationError {
    return new BusinessValidationError(message, [{ field, message, code }]);
  }
}
