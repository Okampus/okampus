import {
  Args,
  Int,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CreateValidationStepDto } from '@modules/org/tenants/validation-steps/dto/create-validation-step.dto';
import { Tenant } from '../tenant.entity';
import { TenantsService } from '../tenants.service';
import { UpdateValidationStepDto } from './dto/update-validation-step.dto';
import { ValidationStep } from './validation-step.entity';
import { ValidationStepsService } from './validation-steps.service';

@Resolver(() => ValidationStep)
export class ValidationStepsResolver {
  constructor(
    private readonly validationStepsService: ValidationStepsService,
    private readonly tenantsService: TenantsService,
  ) {}

  // TODO: Add permission checks
  @Mutation(() => Tenant)
  public async addValidationStep(
    @CurrentTenant() tenant: Tenant,
    @Args('createStep') createStep: CreateValidationStepDto,
  ): Promise<Tenant> {
    await this.validationStepsService.create(tenant, createStep);
    return await this.tenantsService.findOne(tenant.id, true);
  }

  // TODO: Add permission checks
  @Mutation(() => ValidationStep)
  public async updateValidationStep(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateStep') updateStep: UpdateValidationStepDto,
  ): Promise<ValidationStep> {
    return await this.validationStepsService.update(id, updateStep);
  }

  @Mutation(() => Tenant)
  public async insertStep(
    @CurrentTenant() tenant: Tenant,
    @Args('step', { type: () => Int }) step: number,
    @Args('atStep', { type: () => Int }) atStep: number,
  ): Promise<Tenant> {
    return await this.validationStepsService.insertStep(tenant, step, atStep);
  }
}
