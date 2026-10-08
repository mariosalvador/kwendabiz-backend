import { Role } from "../../../identity/domain/enums/role.js";
import { BusinessesRepository } from "../../../business/application/ports/businesses.repository.js";
import { Investment } from "../../domain/entities/investment.js";
import { InvestmentBusinessNotFoundError } from "../errors/business-not-found.error.js";
import { InvestmentForbiddenError } from "../errors/investment-forbidden.error.js";
import type { InvestmentActor } from "../ports/actor.js";
import { InvestmentsRepository } from "../ports/investments.repository.js";

export interface CreateInvestmentInput {
  businessId: string;
  amount: number;
}

export class CreateInvestmentUseCase {
  constructor(
    private readonly investmentsRepository: InvestmentsRepository,
    private readonly businessesRepository: BusinessesRepository,
  ) {}

  async execute(
    actor: InvestmentActor,
    input: CreateInvestmentInput,
  ): Promise<Investment> {
    if (!actor.roles.includes(Role.Investor)) {
      throw new InvestmentForbiddenError();
    }

    const business = await this.businessesRepository.findById(input.businessId);
    if (!business) {
      throw new InvestmentBusinessNotFoundError(input.businessId);
    }

    const investment = Investment.create({
      businessId: business.id,
      investorId: actor.id,
      amount: input.amount,
    });
    await this.investmentsRepository.save(investment);
    return investment;
  }
}
