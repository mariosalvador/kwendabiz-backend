import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  ConflictException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import {
  CurrentUser as CurrentUserDecorator,
  type CurrentUser,
} from "../../../../../authentication/adapters/inbound/http/decorators/current-user.decorator.js";
import { BusinessForbiddenError } from "../../../../application/errors/business-forbidden.error.js";
import { BusinessNotFoundError } from "../../../../application/errors/business-not-found.error.js";
import { CreateBusinessUseCase } from "../../../../application/use-cases/create-business.use-case.js";
import { DeleteBusinessUseCase } from "../../../../application/use-cases/delete-business.use-case.js";
import { GetBusinessUseCase } from "../../../../application/use-cases/get-business.use-case.js";
import { ListBusinessesUseCase } from "../../../../application/use-cases/list-businesses.use-case.js";
import { UpdateBusinessUseCase } from "../../../../application/use-cases/update-business.use-case.js";
import { BusinessValidationError } from "../../../../domain/errors/business-validation.error.js";
import { BusinessSlugAlreadyInUseError } from "../../../../application/errors/slug-already-in-use.error.js";
import type { CreateBusinessDto, UpdateBusinessDto } from "../dto/business.dto.js";

@Controller("businesses")
export class BusinessesController {
  constructor(
    private readonly createBusiness: CreateBusinessUseCase,
    private readonly getBusiness: GetBusinessUseCase,
    private readonly listBusinesses: ListBusinessesUseCase,
    private readonly updateBusiness: UpdateBusinessUseCase,
    private readonly deleteBusiness: DeleteBusinessUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUserDecorator() actor: CurrentUser,
    @Body() body: CreateBusinessDto,
  ) {
    try {
      return (await this.createBusiness.execute(actor, body)).toJSON();
    } catch (error) {
      throw mapBusinessError(error);
    }
  }

  @Get()
  async list(@CurrentUserDecorator() actor: CurrentUser) {
    return (await this.listBusinesses.execute(actor)).map((business) => business.toJSON());
  }

  @Get(":id")
  async get(
    @CurrentUserDecorator() actor: CurrentUser,
    @Param("id") id: string,
  ) {
    try {
      return (await this.getBusiness.execute(actor, id)).toJSON();
    } catch (error) {
      throw mapBusinessError(error);
    }
  }

  @Get("slug/:slug")
  async getBySlug(
    @CurrentUserDecorator() actor: CurrentUser,
    @Param("slug") slug: string,
  ) {
    try {
      return (await this.getBusiness.executeBySlug(actor, slug)).toJSON();
    } catch (error) {
      throw mapBusinessError(error);
    }
  }

  @Patch(":id")
  async update(
    @CurrentUserDecorator() actor: CurrentUser,
    @Param("id") id: string,
    @Body() body: UpdateBusinessDto,
  ) {
    try {
      return (await this.updateBusiness.execute(actor, id, body)).toJSON();
    } catch (error) {
      throw mapBusinessError(error);
    }
  }

  @Delete(":id")
  @HttpCode(204)
  async remove(
    @CurrentUserDecorator() actor: CurrentUser,
    @Param("id") id: string,
  ): Promise<void> {
    try {
      await this.deleteBusiness.execute(actor, id);
    } catch (error) {
      throw mapBusinessError(error);
    }
  }
}

function mapBusinessError(error: unknown): Error {
  if (error instanceof BusinessNotFoundError) {
    return new NotFoundException(error instanceof Error ? error.message : "Business not found");
  }
  if (error instanceof BusinessForbiddenError) {
    return new ForbiddenException(error instanceof Error ? error.message : "Forbidden");
  }
  if (error instanceof BusinessValidationError) {
    return new BadRequestException(error instanceof Error ? error.message : "Invalid business");
  }
  if (error instanceof BusinessSlugAlreadyInUseError) {
    return new ConflictException(error.message);
  }
  return error instanceof Error ? error : new Error("Unexpected business error");
}
