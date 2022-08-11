import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { User } from '../../users/user.entity';
import { ValidationStep } from '../validation-steps/validation-step.entity';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@Resolver(() => Tenant)
export class TenantsResolver {
  constructor(
    private readonly tenantsService: TenantsService,
    @InjectRepository(ValidationStep) private readonly validationStepRepository: BaseRepository<ValidationStep>,
  ) {}

  // TODO: Add permission checks
  @Query(() => Tenant)
  public async tenantById(@Args('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id);
  }

  @ResolveField(() => [ValidationStep])
  public async userValidations(
    @CurrentUser() user: User,
    @Parent() tenant: Tenant,
  ): Promise<ValidationStep[]> {
    return await this.validationStepRepository.find({ users: { id: user.id }, tenant });
  }
}
