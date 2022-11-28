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
import { Public } from '@common/lib/decorators/public.decorator';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import { User } from '@modules/uaa/users/user.entity';
import { OIDCEnabled } from '../../../common/lib/types/models/oidc-enabled.model';
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

  @Query(() => [TenantImage], { nullable: 'items' })
  public async getLogos(@Args('id') id: string): Promise<Array<TenantImage | null>> {
    return Promise.all([
      this.tenantImagesService.findLastActive(id, TenantImageType.Logo),
      this.tenantImagesService.findLastActive(id, TenantImageType.LogoDark),
    ]);
  }

  @Public()
  @Query(() => OIDCEnabled)
  public async oidcEnabled(@Args('id') id: string): Promise<OIDCEnabled> {
    const tenant = await this.tenantsService.findOne(id);
    return { id: tenant.id, tenantOidcName: tenant.tenantOidcName, isEnabled: tenant.oidcEnabled };
  }

  @Mutation(() => Tenant)
  public async unsetLogo(@Args('id') id: string): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(id);
    return await this.tenantsService.setImage(tenant, TenantImageType.Logo, null);
  }

  @Mutation(() => Tenant)
  public async unsetLogoDark(@Args('id') id: string): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(id);
    return await this.tenantsService.setImage(tenant, TenantImageType.LogoDark, null);
  }
}
