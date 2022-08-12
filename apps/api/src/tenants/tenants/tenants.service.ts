import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { Express } from 'express';
import { FileUploadsService } from '../../files/file-uploads/file-uploads.service';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesService } from '../../files/profile-images/profile-images.service';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import type { User } from '../../users/user.entity';
import type { CreateTenantDto } from './dto/create-tenant.dto';
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
    return await this.tenantRepository.findOneOrFail({ id }, populate ? { populate: ['validationSteps', 'validationSteps.users'] } : {});
  }

  public async setLogo(
    user: User,
    isLogoDark: boolean,
    id: string,
    fileUpload: Express.Multer.File,
  ): Promise<ProfileImage> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    // Get previous logo it if it exists and set active to false
    const previousLogo = await this.profileImageRepository.findOne({ tenant, type: isLogoDark ? 'logoDark' : 'logo', active: true });
    if (previousLogo)
      previousLogo.active = false;

    const logoFile = await this.filesService.create(
      user,
      fileUpload,
      FileKind.Tenant,
    );
    const logo = await this.profileImagesService.create(logoFile, isLogoDark ? 'logoDark' : 'logo');
    logo.tenant = tenant;

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
