import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller()
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
  ) {}

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Tenant))
  public async findOne(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return await this.tenantsService.update(id, updateTenantDto);
  }
}
