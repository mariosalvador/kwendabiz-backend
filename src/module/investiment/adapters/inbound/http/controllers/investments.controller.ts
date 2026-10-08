import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  NotFoundException,
} from "@nestjs/common";

import {
  CurrentUser as CurrentUserDecorator,
  type CurrentUser,
} from "../../../../../authentication/adapters/inbound/http/decorators/current-user.decorator.js";
import { InvestmentBusinessNotFoundError } from "../../../../application/errors/business-not-found.error.js";
import { InvestmentForbiddenError } from "../../../../application/errors/investment-forbidden.error.js";
import { CreateInvestmentUseCase } from "../../../../application/use-cases/create-investment.use-case.js";
import { ListMyInvestmentsUseCase } from "../../../../application/use-cases/list-my-investments.use-case.js";
import { InvestmentValidationError } from "../../../../domain/errors/investment-validation.error.js";
import type { CreateInvestmentDto } from "../dto/create-investment.dto.js";

@Controller("investments")
export class InvestmentsController {
  constructor(
    private readonly createInvestment: CreateInvestmentUseCase,
    private readonly listMyInvestments: ListMyInvestmentsUseCase,
  ) {}

  @Post()
  async create(
    @CurrentUserDecorator() actor: CurrentUser,
    @Body() body: CreateInvestmentDto,
  ) {
    try {
      return (await this.createInvestment.execute(actor, body)).toJSON();
    } catch (error) {
      throw mapInvestmentError(error);
    }
  }

  @Get("me")
  async listMine(@CurrentUserDecorator() actor: CurrentUser) {
    return (await this.listMyInvestments.execute(actor)).map((investment) =>
      investment.toJSON(),
    );
  }
}

function mapInvestmentError(error: unknown): Error {
  if (error instanceof InvestmentForbiddenError) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof InvestmentBusinessNotFoundError) {
    return new NotFoundException(error.message);
  }
  if (error instanceof InvestmentValidationError) {
    return new BadRequestException(error.message);
  }
  return error instanceof Error ? error : new Error("Unexpected investment error");
}
