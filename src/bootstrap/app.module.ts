import { Module } from "@nestjs/common";

import { AuthenticationModule } from "../module/authentication/auth.module.js";
import { IdentityModule } from "../module/identity/identity.module.js";

@Module({
  imports: [IdentityModule, AuthenticationModule],
})
export class AppModule {}