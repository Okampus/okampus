import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { User } from '@modules/uaa/users/user.entity';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantImage } from './tenant-images/tenant-image.entity';
import { TenantImagesService } from './tenant-images/tenant-images.service';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@Resolver(() => Tenant)
export class TenantsResolver {
  constructor(
    @InjectRepository(ApprovalStep) private readonly approvalStepRepository: BaseRepository<ApprovalStep>,
    private readonly tenantsService: TenantsService,
    private readonly tenantImagesService: TenantImagesService,
  ) {}

  // TODO: Add permission checks
  @Query(() => Tenant)
  public async tenantById(@Args('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id);
  }


  @Mutation(() => Tenant)
  public async updateTenant(
    @Args('id') id: string,
    @Args('updateTenant') updateTenant: UpdateTenantDto,
  ): Promise<Tenant> {
    return await this.tenantsService.update(id, updateTenant);
  }

  @ResolveField(() => [ApprovalStep])
  public async approvalStepsByUser(
    @CurrentUser() user: User,
    @Parent() tenant: Tenant,
  ): Promise<ApprovalStep[]> {
    return await this.approvalStepRepository.find({ users: { id: user.id }, tenant });
  }

  // TODO: Create a public endpoint for getting tenant metadata
  @Query(() => [TenantImage], { nullable: 'items' })
  public async getLogos(@Args('slug') slug: string): Promise<Array<TenantImage | null>> {
    return Promise.all([
      this.tenantImagesService.findLastActive(slug, TenantImageType.Logo),
      this.tenantImagesService.findLastActive(slug, TenantImageType.LogoDark),
    ]);
  }

  @Mutation(() => Tenant)
  public async unsetLogo(@Args('slug') slug: string): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(slug);
    return await this.tenantsService.setImage(tenant, TenantImageType.Logo, null);
  }

  @Mutation(() => Tenant)
  public async unsetLogoDark(@Args('slug') slug: string): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(slug);
    return await this.tenantsService.setImage(tenant, TenantImageType.LogoDark, null);
  }
}
