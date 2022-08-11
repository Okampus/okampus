import { UniqueConstraintViolationException } from '@mikro-orm/core';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';
import { FileUploadsService } from '../../files/file-uploads/file-uploads.service';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { User } from '../../users/user.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller()
export class TenantsController {
  constructor(
    private readonly tenantsService: TenantsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Tenant))
  public async findOne(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id);
  }

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Tenant))
  public async create(
    @CurrentUser() user: User,
    @Body() createTenantDto: CreateTenantDto,
    @UploadedFile() file: Express.Multer.File | null,
  ): Promise<Tenant> {
    try {
      const fileUpload = file ? await this.filesService.create(
        user,
        file,
        FileKind.Tenant,
      ) : null;

      return await this.tenantsService.create(createTenantDto, fileUpload);
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException)
        throw new BadRequestException('Tenant id already taken');

      throw error;
    }
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
