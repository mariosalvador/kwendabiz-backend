import { ValueObject } from "../../../../shared/core/value-objects/value-object.js";
import { BusinessValidationError } from "../errors/business-validation.error.js";

export interface BusinessLinkProps {
  name: string;
  url: string;
}

export class BusinessLinkValue extends ValueObject<BusinessLinkProps> {
  private constructor(props: BusinessLinkProps) {
    super(props);
  }

  static create(nameRaw: string, urlRaw: string): BusinessLinkValue {
    const name = nameRaw.trim();
    if (!name) {
      throw BusinessValidationError.single("links", "link name is required");
    }
    const url = urlRaw.trim();
    if (!url) {
      throw BusinessValidationError.single("links", "link url is required");
    }
    try {
      new URL(url);
    } catch {
      throw BusinessValidationError.single("links", "Link url must be a valid URL");
    }
    return new BusinessLinkValue({ name, url });
  }
}
