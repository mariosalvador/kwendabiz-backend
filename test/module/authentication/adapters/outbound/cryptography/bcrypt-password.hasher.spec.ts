import { BcryptPasswordHasher } from "../../../../../../src/module/authentication/adapters/outbound/cryptography/bcrypt-password.hasher.js";

describe("BcryptPasswordHasher", () => {
  it("hashes and compares passwords without storing the plain text", async () => {
    const hasher = new BcryptPasswordHasher();
    const password = "password123";
    const hash = await hasher.hash(password);

    expect(hash).not.toContain(password);
    expect(hash.startsWith("$2")).toBe(true);
    expect(await hasher.compare(password, hash)).toBe(true);
    expect(await hasher.compare("wrong-password", hash)).toBe(false);
  });

  it("rejects passwords shorter than eight characters", async () => {
    const hasher = new BcryptPasswordHasher();

    await expect(hasher.hash("short")).rejects.toThrow(
      "Password must contain at least 8 characters",
    );
  });
});
