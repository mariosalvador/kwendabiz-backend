import { Module } from "@nestjs/common";

import { IdentityModule } from "../module/identity/identity.module.js";

@Module({
  imports: [IdentityModule],
})
export class AppModule {}