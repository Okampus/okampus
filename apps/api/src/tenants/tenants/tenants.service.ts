import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import type { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
  ) {}

  public async findOne(id: string): Promise<Tenant> {
    return await this.tenantRepository.findOneOrFail({ id });
  }

  public async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOneOrFail({ id });

    wrap(tenant).assign(updateTenantDto);
    await this.tenantRepository.flush();
    return tenant;
  }
}
