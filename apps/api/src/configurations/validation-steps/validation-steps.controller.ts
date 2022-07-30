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
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { CreateValidationStepDto } from './dto/create-validation-step.dto';
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

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, ValidationStep))
  public async create(@Body() createValidationStepDto: CreateValidationStepDto): Promise<ValidationStep> {
    return await this.validationStepsService.create(createValidationStepDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, ValidationStep))
  public async findAll(@Query() query: ListValidationStepsDto): Promise<ValidationStep[]> {
    return await this.validationStepsService.findAll(query.type);
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
    @Param('id', ParseIntPipe) id: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.validationStepsService.removeUser(id, userId);
  }
}