import { BusinessNotFoundError } from "../errors/business-not-found.error.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";
import { ensureCanManage } from "./get-business.use-case.js";

export class DeleteBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, id: string): Promise<void> {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new BusinessNotFoundError(id);
    ensureCanManage(actor, business.ownerId);
    await this.businessesRepository.delete(id);
  }
}
