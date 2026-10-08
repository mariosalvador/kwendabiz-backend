import { Role } from "../../../identity/domain/enums/role.js";
import { Business, type CreateBusinessProps } from "../../domain/entities/business.js";
import { BusinessForbiddenError } from "../errors/business-forbidden.error.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";
import type { BusinessActor } from "../ports/actor.js";

export type CreateBusinessInput = Omit<CreateBusinessProps, "ownerId" | "id" | "createdAt" | "updatedAt">;

export class CreateBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, input: CreateBusinessInput): Promise<Business> {
    if (!actor.roles.includes(Role.Entrepreneur)) {
      throw new BusinessForbiddenError();
    }
    const business = Business.create({ ...input, ownerId: actor.id });
    await this.businessesRepository.save(business);
    return business;
  }
}
