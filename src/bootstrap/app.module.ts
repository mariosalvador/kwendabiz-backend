import { Module } from "@nestjs/common";

import { AuthenticationModule } from "../module/authentication/auth.module.js";
import { BusinessModule } from "../module/business/business.module.js";
import { IdentityModule } from "../module/identity/identity.module.js";

@Module({
  imports: [IdentityModule, AuthenticationModule, BusinessModule],
})
export class AppModule {}