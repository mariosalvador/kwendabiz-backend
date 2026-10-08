import { Business } from "../../domain/entities/business.js";

export abstract class BusinessesRepository {
  abstract findById(id: string): Promise<Business | null>;
  abstract findBySlug(slug: string): Promise<Business | null>;
  abstract findAll(): Promise<Business[]>;
  abstract findByOwnerId(ownerId: string): Promise<Business[]>;
  abstract save(business: Business): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
