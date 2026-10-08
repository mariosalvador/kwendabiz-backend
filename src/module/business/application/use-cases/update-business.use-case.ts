import { Business, type CreateBusinessProps } from "../../domain/entities/business.js";
import { BusinessNotFoundError } from "../errors/business-not-found.error.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";
import { ensureCanManage } from "./get-business.use-case.js";

export type UpdateBusinessInput = Partial<Omit<CreateBusinessProps, "ownerId" | "id" | "createdAt" | "updatedAt">>;

export class UpdateBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, id: string, input: UpdateBusinessInput): Promise<Business> {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new BusinessNotFoundError(id);
    ensureCanManage(actor, business.ownerId);
    business.update(input);
    await this.businessesRepository.save(business);
    return business;
  }
}
