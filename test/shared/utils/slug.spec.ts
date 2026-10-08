import { createSlug } from "../../../src/shared/utils/slug.js";

describe("createSlug", () => {
  it("normalizes accents, spaces and punctuation", () => {
    expect(createSlug("Empreendedor São José & Filhos")).toBe(
      "empreendedor-sao-jose-filhos",
    );
  });

  it("rejects values that cannot produce a slug", () => {
    expect(() => createSlug("!!!")).toThrow("Cannot create a slug");
  });
});
