import { Investment } from "../../../../domain/entities/investment.js";
import { InvestmentsRepository } from "../../../../application/ports/investments.repository.js";

export class InMemoryInvestmentsRepository implements InvestmentsRepository {
  private readonly investments = new Map<string, Investment>();

  findById(id: string): Promise<Investment | null> {
    return Promise.resolve(this.investments.get(id) ?? null);
  }

  findByInvestorId(investorId: string): Promise<Investment[]> {
    return Promise.resolve(
      [...this.investments.values()].filter(
        (investment) => investment.investorId === investorId,
      ),
    );
  }

  findByBusinessId(businessId: string): Promise<Investment[]> {
    return Promise.resolve(
      [...this.investments.values()].filter(
        (investment) => investment.businessId === businessId,
      ),
    );
  }

  save(investment: Investment): Promise<void> {
    this.investments.set(investment.id, investment);
    return Promise.resolve();
  }
}
