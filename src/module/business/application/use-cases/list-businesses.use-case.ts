import { Business } from "../../domain/entities/business.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";

export class ListBusinessesUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  execute(actor: BusinessActor): Promise<Business[]> {
    if (actor.roles.includes("admin")) return this.businessesRepository.findAll();
    return this.businessesRepository.findByOwnerId(actor.id);
  }
}
