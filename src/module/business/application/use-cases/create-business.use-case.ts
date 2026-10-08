import { Role } from "../../../identity/domain/enums/role.js";
import { Business, type CreateBusinessProps } from "../../domain/entities/business.js";
import { BusinessForbiddenError } from "../errors/business-forbidden.error.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessSlugAlreadyInUseError } from "../errors/slug-already-in-use.error.js";
import { createSlug } from "../../../../shared/utils/slug.js";

export type CreateBusinessInput = Omit<CreateBusinessProps, "ownerId" | "id" | "createdAt" | "updatedAt">;

export class CreateBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, input: CreateBusinessInput): Promise<Business> {
    if (!actor.roles.includes(Role.Entrepreneur)) {
      throw new BusinessForbiddenError();
    }
    const slug = createSlug(input.name);
    if (await this.businessesRepository.findBySlug(slug)) {
      throw new BusinessSlugAlreadyInUseError(slug);
    }
    const business = Business.create({ ...input, ownerId: actor.id });
    await this.businessesRepository.save(business);
    return business;
  }
}
