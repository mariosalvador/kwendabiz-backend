import { Module } from "@nestjs/common";

import { BusinessModule } from "../business/business.module.js";
import { InvestmentsController } from "./adapters/inbound/http/controllers/investments.controller.js";
import { InMemoryInvestmentsRepository } from "./adapters/outbound/persistence/in-memory/in-memory-investments.repository.js";
import { InvestmentsRepository } from "./application/ports/investments.repository.js";
import { CreateInvestmentUseCase } from "./application/use-cases/create-investment.use-case.js";
import { ListMyInvestmentsUseCase } from "./application/use-cases/list-my-investments.use-case.js";

@Module({
  imports: [BusinessModule],
  controllers: [InvestmentsController],
  providers: [
    CreateInvestmentUseCase,
    ListMyInvestmentsUseCase,
    {
      provide: InvestmentsRepository,
      useClass: InMemoryInvestmentsRepository,
    },
  ],
})
export class InvestimentModule {}