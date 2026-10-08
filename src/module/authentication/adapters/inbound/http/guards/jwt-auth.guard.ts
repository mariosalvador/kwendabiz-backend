import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

import { IS_PUBLIC_KEY } from "../decorators/public.decorator.js";
import { JwtStrategy, type JwtPayload } from "../strategies/jwt.strategy.js";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string }; user?: unknown }>();
    const token = request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new UnauthorizedException("Bearer token is required");

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (payload.type !== "access") throw new UnauthorizedException("Access token required");
      request.user = this.jwtStrategy.validate(payload);
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }
}
