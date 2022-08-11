import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { FileUpload } from '../../files/file-uploads/file-upload.entity';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { CreateTenantDto } from './dto/create-tenant.dto';
import type { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,

  ) {}

  public async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = new Tenant({ ...createTenantDto });

    await this.tenantRepository.persistAndFlush(tenant);
    return tenant;
  }

  public async findOne(id: string): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ id }, { populate: ['validationSteps', 'validationSteps.users'] });
  }

  public async setLogo(id: string, fileUpload: FileUpload): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    tenant.logo = fileUpload;
    await this.tenantRepository.flush();
    return tenant;
  }

  public async setLogoDark(id: string, fileUpload: FileUpload): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    tenant.logoDark = fileUpload;
    await this.tenantRepository.flush();
    return tenant;
  }

  public async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    wrap(tenant).assign(updateTenantDto);
    await this.tenantRepository.flush();
    return tenant;
  }
}
