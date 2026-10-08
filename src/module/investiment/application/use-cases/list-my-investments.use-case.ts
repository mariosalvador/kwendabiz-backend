import { Investment } from "../../domain/entities/investment.js";
import type { InvestmentActor } from "../ports/actor.js";
import { InvestmentsRepository } from "../ports/investments.repository.js";

export class ListMyInvestmentsUseCase {
  constructor(private readonly investmentsRepository: InvestmentsRepository) {}

  execute(actor: InvestmentActor): Promise<Investment[]> {
    return this.investmentsRepository.findByInvestorId(actor.id);
  }
}
