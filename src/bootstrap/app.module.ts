import { Module } from "@nestjs/common";

import { AuthenticationModule } from "../module/authentication/auth.module.js";
import { BusinessModule } from "../module/business/business.module.js";
import { IdentityModule } from "../module/identity/identity.module.js";
import { InvestimentModule } from "../module/investiment/investiment.module.js";
import { DatabaseModule } from "../shared/database/database.module.js";

@Module({
  imports: [
    DatabaseModule,
    IdentityModule,
    AuthenticationModule,
    BusinessModule,
    InvestimentModule,
  ],
})
export class AppModule {}