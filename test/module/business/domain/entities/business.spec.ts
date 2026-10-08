import { Business } from "../../../../../src/module/business/domain/entities/business.js";
import { BusinessValidationError } from "../../../../../src/module/business/domain/errors/business-validation.error.js";

describe("Business", () => {
  const validInput = {
    ownerId: "user-1",
    name: "Kwenda Biz",
    category: "Technology",
    phone: "+351 900 000 000",
  };

  it("creates a business with optional links and bank details", () => {
    const business = Business.create({
      ...validInput,
      email: "contact@kwenda.biz",
      links: [{ name: "Website", url: "https://kwenda.biz" }],
      logo: "https://kwenda.biz/logo.png",
      bankDetails: {
        bankName: "Example Bank",
        iban: "PT50000201231234567890154",
      },
    });

    expect(business.toJSON()).toMatchObject({
      ...validInput,
      email: "contact@kwenda.biz",
      links: [{ name: "Website", url: "https://kwenda.biz" }],
      bankDetails: {
        bankName: "Example Bank",
        iban: "PT50000201231234567890154",
      },
    });
  });

  it.each([
    { name: "", category: "Technology", phone: "+351 900 000 000" },
    { name: "Business", category: "Technology", phone: "" },
    { name: "Business", category: "Technology", phone: "+351", email: "invalid" },
  ])("rejects invalid business data: %o", (input) => {
    expect(() => Business.create({ ...validInput, ...input })).toThrow(BusinessValidationError);
  });
});
