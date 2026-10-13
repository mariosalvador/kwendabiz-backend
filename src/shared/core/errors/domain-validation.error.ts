export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

export class DomainValidationError extends Error {
  readonly errors: readonly ValidationErrorDetail[];

  constructor(message: string, errors: ValidationErrorDetail[] = []) {
    super(message);
    this.name = "DomainValidationError";
    this.errors = errors.length > 0 ? errors : [{ field: "general", message }];
  }

  static single(field: string, message: string, code?: string): DomainValidationError {
    return new DomainValidationError(message, [{ field, message, code }]);
  }
}
