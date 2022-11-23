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
import { TenantLogoUrls } from '@common/lib/types/models/tenant-logos.model';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { User } from '@modules/uua/users/user.entity';
import { OIDCEnabled } from '../../../common/lib/types/models/oidc-enabled.model';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';
import { ValidationStep } from './validation-steps/validation-step.entity';

@Resolver(() => Tenant)
export class TenantsResolver {
  constructor(
    private readonly tenantsService: TenantsService,
    @InjectRepository(ValidationStep) private readonly validationStepRepository: BaseRepository<ValidationStep>,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
  ) {}

  // TODO: Add permission checks
  @Query(() => Tenant)
  public async tenantById(@Args('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id, true);
  }

  @Mutation(() => Tenant)
  public async updateTenant(
    @Args('id') id: string,
    @Args('updateTenant') updateTenant: UpdateTenantDto,
  ): Promise<Tenant> {
    return await this.tenantsService.update(id, updateTenant);
  }

  @ResolveField(() => [ValidationStep])
  public async userValidations(
    @CurrentUser() user: User,
    @Parent() tenant: Tenant,
  ): Promise<ValidationStep[]> {
    return await this.validationStepRepository.find({ users: { id: user.id }, tenant });
  }

  @Query(() => [ProfileImage])
  public async getLogos(@Args('id') id: string): Promise<ProfileImage[]> {
    const tenant = await this.tenantsService.findOne(id);
    return await this.profileImageRepository.find({ tenant, type: { $in: ['logo', 'logoDark'] }, active: true }, { populate: ['file', 'file.user'] });
  }

  @Public()
  @Query(() => TenantLogoUrls)
  public async getLogoUrls(@Args('id') id: string): Promise<TenantLogoUrls> {
    const tenant = await this.tenantsService.findOne(id);
    return { id: tenant.id, logoUrl: tenant.logo ?? null, logoDarkUrl: tenant.logoDark ?? null };
  }

  @Public()
  @Query(() => OIDCEnabled)
  public async oidcEnabled(@Args('id') id: string): Promise<OIDCEnabled> {
    const tenant = await this.tenantsService.findOne(id);
    return { id: tenant.id, tenantOidcName: tenant.tenantOidcName, isEnabled: tenant.oidcEnabled };
  }

  // TODO: Add permission checks
  @Mutation(() => Tenant)
  public async unsetLogo(
    @Args('id') id: string,
    @Args('isLogoDark') isLogoDark: boolean,
  ): Promise<Tenant> {
    const tenant = await this.tenantsService.findOne(id);

    const previousLogo = await this.profileImageRepository.findOne({ tenant, type: isLogoDark ? 'logoDark' : 'logo', active: true });
    if (previousLogo) {
      previousLogo.active = false;
      previousLogo.lastActiveDate = new Date();
    }

    if (isLogoDark)
      tenant.logoDark = null;
    else
      tenant.logo = null;

    await this.profileImageRepository.flush();
    await this.tenantRepository.flush();
    return tenant;
  }
}
