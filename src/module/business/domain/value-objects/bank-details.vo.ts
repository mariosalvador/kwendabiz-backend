import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { BusinessValidationError } from "../errors/business-validation.error.js";
import { Iban } from "./iban.vo.js";

export interface BankDetailsProps {
  bankName: string;
  iban: string;
}

export class BankDetailsValue extends ValueObject<BankDetailsProps> {
  private constructor(props: BankDetailsProps) {
    super(props);
  }

  static create(raw: BankDetailsProps): BankDetailsValue {
    const bankName = raw.bankName.trim();
    if (!bankName) {
      throw BusinessValidationError.single("bankName", "bank name is required");
    }
    const iban = Iban.create(raw.iban).value;
    return new BankDetailsValue({ bankName, iban });
  }
}
