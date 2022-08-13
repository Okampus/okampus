import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { Public } from '../../shared/lib/decorators/public.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { User } from '../../users/user.entity';
import { ValidationStep } from '../validation-steps/validation-step.entity';
import { TenantLogoUrls } from './tenant-logos.model';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

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
