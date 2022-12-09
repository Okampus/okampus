import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { GlobalRequestService } from '@common/lib/helpers/global-request-service';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { catchUniqueViolation } from '@common/lib/utils/catch-unique-violation';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import type { CreateTenantDto } from '@modules/org/tenants/dto/create-tenant.dto';
import type { UpdateTenantDto } from './dto/update-tenant.dto';
import type { CreateTenantImageDto } from './tenant-images/dto/create-tenant-image.dto';
import type { TenantImage } from './tenant-images/tenant-image.entity';
import { TenantImagesService } from './tenant-images/tenant-images.service';
import { Tenant } from './tenant.entity';

const tenantImageTypeToKey = {
  [TenantImageType.Logo]: 'logo' as const,
  [TenantImageType.LogoDark]: 'logoDark' as const,
};

@Injectable()
export class TenantsService extends GlobalRequestService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    private readonly tenantImagesService: TenantImagesService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) { super(); }

  public async findBareTenant(slug: string): Promise<Tenant | null> {
    return await this.tenantRepository.findOne({ slug });
  }

  public async findOne(slug: string): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ slug }, { populate: this.autoGqlPopulate() });
  }

  public async create(
    createTenantDto: Omit<CreateTenantDto, 'logo' | 'logoDark'>,
    files: { logo?: MulterFile[]; logoDark?: MulterFile[] } | null = null,
  ): Promise<Tenant> {
    const tenant = new Tenant({ ...createTenantDto });
    await catchUniqueViolation(this.tenantRepository, tenant);

    if (files?.logo?.length)
      await this.addImage(files.logo[0], { tenantSlug: tenant.slug, type: TenantImageType.Logo });

    if (files?.logoDark?.length)
      await this.addImage(files.logoDark[0], { tenantSlug: tenant.slug, type: TenantImageType.Logo });

    return tenant;
  }

  public async find(): Promise<Tenant[]> {
    return await this.tenantRepository.findAll({ populate: this.autoGqlPopulate() });
  }

  public async addImage(file: MulterFile, createTenantImageDto: CreateTenantImageDto): Promise<Tenant> {
    const tenantImage = await this.tenantImagesService.create(file, createTenantImageDto);
    if (tenantImage.type === TenantImageType.Logo || tenantImage.type === TenantImageType.LogoDark) {
      const user = await this.setImage(tenantImage.tenant, tenantImage.type, tenantImage);

      await this.tenantRepository.flush();
      return user;
    }

    return tenantImage.tenant;
  }

  public async setImage(
    tenant: Tenant,
    type: TenantImageType.Logo | TenantImageType.LogoDark,
    tenantImage: TenantImage | string | null,
  ): Promise<Tenant> {
    const ability = this.caslAbilityFactory.createForUser(this.currentUser());
    assertPermissions(ability, Action.Update, tenant);

    if (typeof tenantImage === 'string') // TenantImage passed by ID
      tenantImage = await this.tenantImagesService.findOne(tenantImage);

    if (tenantImage)
      tenantImage.active = true;

    tenant[tenantImageTypeToKey[type]] = tenantImage;
    await this.tenantImagesService.setInactiveLastActive(tenant.slug, type);
    await this.tenantRepository.flush();

    return tenant;
  }

  public async update(slug: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ slug });

    wrap(tenant).assign(updateTenantDto);
    await this.tenantRepository.flush();
    return tenant;
  }

  public async delete(slug: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ slug });
    await this.tenantRepository.removeAndFlush(tenant);
    return tenant;
  }
}
