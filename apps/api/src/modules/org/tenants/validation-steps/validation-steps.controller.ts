import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentTenant } from '@meta/shared/lib/decorators/current-tenant.decorator';
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { CreateValidationStepDto } from '@modules/org/tenants/validation-steps/dto/create-validation-step.dto';
import { Tenant } from '../tenant.entity';
import { ListValidationStepsDto } from './dto/list-validation-steps.dto';
import { UpdateValidationStepDto } from './dto/update-validation-step.dto';
import { ValidationStep } from './validation-step.entity';
import { ValidationStepsService } from './validation-steps.service';

@ApiTags('ValidationSteps')
@Controller()
export class ValidationStepsController {
  constructor(
    private readonly validationStepsService: ValidationStepsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Create, ValidationStep))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @Body() createValidationStepDto: CreateValidationStepDto,
  ): Promise<ValidationStep> {
    return await this.validationStepsService.create(tenant, createValidationStepDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, ValidationStep))
  public async findAll(
    @CurrentTenant() tenant: Tenant,
    @Query() query: ListValidationStepsDto,
  ): Promise<ValidationStep[]> {
    return await this.validationStepsService.findAll(tenant, query.type);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, ValidationStep))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateValidationStepDto: UpdateValidationStepDto): Promise<ValidationStep> {
    return await this.validationStepsService.update(id, updateValidationStepDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, ValidationStep))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.validationStepsService.remove(id);
  }

  @Post(':id/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ValidationStep))
  public async addUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<ValidationStep> {
    return await this.validationStepsService.addUser(id, userId);
  }

  @Delete(':id/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, ValidationStep))
  public async removeUser(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.validationStepsService.removeUser(tenant, id, userId);
  }
}
