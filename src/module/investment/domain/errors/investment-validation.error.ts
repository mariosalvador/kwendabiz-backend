import {
  DomainValidationError,
  type ValidationErrorDetail,
} from "../../../../shared/core/errors/domain-validation.error.js";

export class InvestmentValidationError extends DomainValidationError {
  constructor(message: string, errors: ValidationErrorDetail[] = []) {
    super(message, errors);
    this.name = "InvestmentValidationError";
  }

  static override single(field: string, message: string, code?: string): InvestmentValidationError {
    return new InvestmentValidationError(message, [{ field, message, code }]);
  }
}
