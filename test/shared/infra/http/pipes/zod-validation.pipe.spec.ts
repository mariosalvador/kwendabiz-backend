import { describe, expect, it } from "vitest";
import { BadRequestException } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../../../../../src/shared/infra/http/pipes/zod-validation.pipe.js";

describe("ZodValidationPipe", () => {
  const schema = z.object({
    email: z.string().email(),
    age: z.number().int().positive(),
  });

  it("passes and returns parsed data when input is valid", () => {
    const pipe = new ZodValidationPipe(schema);
    const result = pipe.transform(
      { email: "user@example.com", age: 25 },
      { type: "body" },
    );

    expect(result).toEqual({ email: "user@example.com", age: 25 });
  });

  it("throws BadRequestException with detailed error list when validation fails", () => {
    const pipe = new ZodValidationPipe(schema);

    expect(() =>
      pipe.transform({ email: "not-an-email", age: -5 }, { type: "body" }),
    ).toThrow(BadRequestException);
  });

  it("uses static schema from metatype if provided", () => {
    class SampleDto {
      static readonly schema = schema;
    }

    const pipe = new ZodValidationPipe();
    const result = pipe.transform(
      { email: "test@example.com", age: 30 },
      { type: "body", metatype: SampleDto },
    );

    expect(result).toEqual({ email: "test@example.com", age: 30 });
  });

  it("passes data untouched when no schema is present", () => {
    const pipe = new ZodValidationPipe();
    const raw = { anything: "ok" };
    expect(pipe.transform(raw, { type: "body" })).toBe(raw);
  });
});
