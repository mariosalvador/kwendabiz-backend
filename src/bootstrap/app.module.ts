import { Module } from "@nestjs/common";

import { AuthenticationModule } from "../module/authentication/auth.module.js";
import { BusinessModule } from "../module/business/business.module.js";
import { IdentityModule } from "../module/identity/identity.module.js";
import { InvestmentModule } from "../module/investment/investment.module.js";
import { DatabaseModule } from "../shared/database/database.module.js";

@Module({
  imports: [
    DatabaseModule,
    IdentityModule,
    AuthenticationModule,
    BusinessModule,
    InvestmentModule,
  ],
})
export class AppModule {}