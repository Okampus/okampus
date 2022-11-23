import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import type { CreateTenantDto } from '@modules/org/tenants/dto/create-tenant.dto';
import { FileUploadsService } from '@modules/store/file-uploads/file-uploads.service';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { ProfileImagesService } from '@modules/store/profile-images/profile-images.service';
import type { User } from '@modules/uua/users/user.entity';
import type { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    private readonly filesService: FileUploadsService,
    private readonly profileImagesService: ProfileImagesService,
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
  ) {}

  public async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = new Tenant({ ...createTenantDto });

    await this.tenantRepository.persistAndFlush(tenant);
    return tenant;
  }

  public async findOne(id: string, populate = false): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ id }, populate ? {
 populate: [
      // 'validationSteps', 'validationSteps.users'
    ],
} : {});
  }

  public async find(populate = false): Promise<Tenant[]> {
    return await this.tenantRepository.find({}, populate ? {
 populate: [
      // 'validationSteps', 'validationSteps.users'
    ],
} : {});
  }

  public async setLogo(
    user: User,
    isLogoDark: boolean,
    id: string,
    fileUpload: MulterFile,
  ): Promise<ProfileImage> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    // Get previous logo it if it exists and set active to false
    const previousLogo = await this.profileImageRepository.findOne({ tenant, type: isLogoDark ? 'logoDark' : 'logo', active: true });
    if (previousLogo) {
      previousLogo.active = false;
      previousLogo.lastActiveDate = new Date();
    }

    const logoFile = await this.filesService.create(
      tenant,
      user,
      fileUpload,
      FileKind.Tenant,
    );
    const logo = await this.profileImagesService.create(logoFile, isLogoDark ? 'logoDark' : 'logo');
    logo.tenant = tenant;
    logo.active = true;

    if (isLogoDark)
      tenant.logoDark = logoFile.url;
    else
      tenant.logo = logoFile.url;

    await this.tenantRepository.flush();
    await this.profileImageRepository.flush();

    return logo;
  }

  public async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    wrap(tenant).assign(updateTenantDto);
    await this.tenantRepository.flush();
    return tenant;
  }

  public async delete(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });
    await this.tenantRepository.removeAndFlush(tenant);
    return tenant;
  }
}
