import { Business } from "../../domain/entities/business.js";
import { BusinessForbiddenError } from "../errors/business-forbidden.error.js";
import { BusinessNotFoundError } from "../errors/business-not-found.error.js";
import type { BusinessActor } from "../ports/actor.js";
import { BusinessesRepository } from "../ports/businesses.repository.js";

export class GetBusinessUseCase {
  constructor(private readonly businessesRepository: BusinessesRepository) {}

  async execute(actor: BusinessActor, id: string): Promise<Business> {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new BusinessNotFoundError(id);
    ensureCanManage(actor, business.ownerId);
    return business;
  }

  async executeBySlug(actor: BusinessActor, slug: string): Promise<Business> {
    const business = await this.businessesRepository.findBySlug(slug);
    if (!business) throw new BusinessNotFoundError(slug);
    ensureCanManage(actor, business.ownerId);
    return business;
  }
}

export function ensureCanManage(actor: BusinessActor, ownerId: string): void {
  if (actor.id !== ownerId && !actor.roles.includes("admin")) {
    throw new BusinessForbiddenError();
  }
}
