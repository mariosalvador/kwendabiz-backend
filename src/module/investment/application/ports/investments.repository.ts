import { Investment } from "../../domain/entities/investment.js";

export abstract class InvestmentsRepository {
  abstract findById(id: string): Promise<Investment | null>;
  abstract findByInvestorId(investorId: string): Promise<Investment[]>;
  abstract findByBusinessId(businessId: string): Promise<Investment[]>;
  abstract save(investment: Investment): Promise<void>;
}
