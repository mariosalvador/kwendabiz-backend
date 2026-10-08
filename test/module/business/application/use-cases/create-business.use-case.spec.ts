import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { BusinessForbiddenError } from "../../../../../src/module/business/application/errors/business-forbidden.error.js";
import { CreateBusinessUseCase } from "../../../../../src/module/business/application/use-cases/create-business.use-case.js";
import { InMemoryBusinessesRepository } from "../../../../../src/module/business/adapters/outbound/persistence/in-memory/in-memory-businesses.repository.js";

describe("CreateBusinessUseCase", () => {
  it("allows an entrepreneur to create a business owned by the actor", async () => {
    const repository = new InMemoryBusinessesRepository();
    const useCase = new CreateBusinessUseCase(repository);

    const business = await useCase.execute(
      { id: "user-1", roles: [Role.Entrepreneur] },
      {
        name: "Kwenda Biz",
        category: "Technology",
        phone: "+351 900 000 000",
      },
    );

    expect(business.ownerId).toBe("user-1");
    expect(await repository.findByOwnerId("user-1")).toHaveLength(1);
  });

  it("rejects users without the entrepreneur role", async () => {
    const useCase = new CreateBusinessUseCase(new InMemoryBusinessesRepository());

    await expect(
      useCase.execute(
        { id: "user-1", roles: [Role.Client] },
        {
          name: "Kwenda Biz",
          category: "Technology",
          phone: "+351 900 000 000",
        },
      ),
    ).rejects.toThrow(BusinessForbiddenError);
  });
});
