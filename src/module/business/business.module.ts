import { Module } from "@nestjs/common";

import { BusinessesController } from "./adapters/inbound/http/controllers/businesses.controller.js";
import { InMemoryBusinessesRepository } from "./adapters/outbound/persistence/in-memory/in-memory-businesses.repository.js";
import { BusinessesRepository } from "./application/ports/businesses.repository.js";
import { CreateBusinessUseCase } from "./application/use-cases/create-business.use-case.js";
import { DeleteBusinessUseCase } from "./application/use-cases/delete-business.use-case.js";
import { GetBusinessUseCase } from "./application/use-cases/get-business.use-case.js";
import { ListBusinessesUseCase } from "./application/use-cases/list-businesses.use-case.js";
import { UpdateBusinessUseCase } from "./application/use-cases/update-business.use-case.js";

@Module({
  controllers: [BusinessesController],
  providers: [
    CreateBusinessUseCase,
    GetBusinessUseCase,
    ListBusinessesUseCase,
    UpdateBusinessUseCase,
    DeleteBusinessUseCase,
    {
      provide: BusinessesRepository,
      useClass: InMemoryBusinessesRepository,
    },
  ],
  exports: [BusinessesRepository],
})
export class BusinessModule {}