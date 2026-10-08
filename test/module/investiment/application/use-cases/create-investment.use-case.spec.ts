import { Role } from "../../../../../src/module/identity/domain/enums/role.js";
import { Business } from "../../../../../src/module/business/domain/entities/business.js";
import { InMemoryBusinessesRepository } from "../../../../../src/module/business/adapters/outbound/persistence/in-memory/in-memory-businesses.repository.js";
import { InvestmentForbiddenError } from "../../../../../src/module/investiment/application/errors/investment-forbidden.error.js";
import { InvestmentBusinessNotFoundError } from "../../../../../src/module/investiment/application/errors/business-not-found.error.js";
import { InMemoryInvestmentsRepository } from "../../../../../src/module/investiment/adapters/outbound/persistence/in-memory/in-memory-investments.repository.js";
import { CreateInvestmentUseCase } from "../../../../../src/module/investiment/application/use-cases/create-investment.use-case.js";

describe("CreateInvestmentUseCase", () => {
  const business = Business.create({
    ownerId: "entrepreneur-1",
    name: "Kwenda Biz",
    category: "Technology",
    phone: "+351 900 000 000",
  });

  it("allows an investor to invest in an existing business", async () => {
    const businesses = new InMemoryBusinessesRepository();
    await businesses.save(business);
    const investments = new InMemoryInvestmentsRepository();
    const useCase = new CreateInvestmentUseCase(investments, businesses);

    const investment = await useCase.execute(
      { id: "investor-1", roles: [Role.Investor] },
      { businessId: business.id, amount: 1000 },
    );

    expect(investment.investorId).toBe("investor-1");
    expect(investment.businessId).toBe(business.id);
  });

  it("rejects users without the investor role", async () => {
    const useCase = new CreateInvestmentUseCase(
      new InMemoryInvestmentsRepository(),
      new InMemoryBusinessesRepository(),
    );

    await expect(
      useCase.execute(
        { id: "client-1", roles: [Role.Client] },
        { businessId: "business-1", amount: 1000 },
      ),
    ).rejects.toThrow(InvestmentForbiddenError);
  });

  it("rejects investments for an unknown business", async () => {
    const useCase = new CreateInvestmentUseCase(
      new InMemoryInvestmentsRepository(),
      new InMemoryBusinessesRepository(),
    );

    await expect(
      useCase.execute(
        { id: "investor-1", roles: [Role.Investor] },
        { businessId: "unknown", amount: 1000 },
      ),
    ).rejects.toThrow(InvestmentBusinessNotFoundError);
  });
});
