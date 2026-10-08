import { Business } from "../../../../domain/entities/business.js";
import { BusinessesRepository } from "../../../../application/ports/businesses.repository.js";

export class InMemoryBusinessesRepository implements BusinessesRepository {
  private readonly businesses = new Map<string, Business>();

  findById(id: string): Promise<Business | null> {
    return Promise.resolve(this.businesses.get(id) ?? null);
  }

  findAll(): Promise<Business[]> {
    return Promise.resolve([...this.businesses.values()]);
  }

  findByOwnerId(ownerId: string): Promise<Business[]> {
    return Promise.resolve(
      [...this.businesses.values()].filter((business) => business.ownerId === ownerId),
    );
  }

  save(business: Business): Promise<void> {
    this.businesses.set(business.id, business);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    this.businesses.delete(id);
    return Promise.resolve();
  }
}
