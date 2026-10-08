import { Business, type CreateBusinessProps } from "../../domain/entities/business.js";
import { BusinessNotFoundError } from "../errors/business-not-found.error.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";
import { ensureCanManage } from "./get-business.use-case.js";
import { BusinessSlugAlreadyInUseError } from "../errors/slug-already-in-use.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";

export type UpdateBusinessInput = Partial<Omit<CreateBusinessProps, "ownerId" | "id" | "createdAt" | "updatedAt">>;

export class UpdateBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, id: string, input: UpdateBusinessInput): Promise<Business> {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new BusinessNotFoundError(id);
    ensureCanManage(actor, business.ownerId);
    if (input.name !== undefined) {
      const slug = createSlug(input.name);
      const existingBusiness = await this.businessesRepository.findBySlug(slug);
      if (existingBusiness && existingBusiness.id !== business.id) {
        throw new BusinessSlugAlreadyInUseError(slug);
      }
    }
    business.update(input);
    await this.businessesRepository.save(business);
    return business;
  }
}
