import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { simpleImageMimeTypeRegex } from '@common/configs/mime-type';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { UploadInterceptor, UploadMultipleInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CreateTenantDto } from '@modules/org/tenants/dto/create-tenant.dto';
import { User } from '@modules/uaa/users/user.entity';
import { FileUploadsService } from '@modules/upload/file-uploads/file-uploads.service';
import type { ProfileImage } from '@modules/upload/profile-images/profile-image.entity';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller()
export class TenantsController {
  constructor(
    @InjectRepository(Tenant) private readonly tenantRepository: BaseRepository<Tenant>,
    private readonly tenantsService: TenantsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Tenant))
  public async findOne(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.findOne(id, true);
  }

  @UploadMultipleInterceptor(['logo', 'logoDark'])
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Tenant))
  public async create(
    @CurrentUser() user: User,
    @Body() createTenantDto: CreateTenantDto,
    @UploadedFiles() files: { logo?: MulterFile[]; logoDark?: MulterFile[] } | null,
  ): Promise<Tenant> {
    try {
      const tenant = await this.tenantsService.create(createTenantDto);

      if (files?.logo?.length) {
        const logoUpload = await this.filesService.create(
          tenant,
          user,
          files.logo[0],
          FileKind.Tenant,
        );
        if (logoUpload)
          tenant.logo = logoUpload.url;
      }

      if (files?.logoDark?.length) {
        const logoDarkUpload = await this.filesService.create(
          tenant,
          user,
          files.logoDark[0],
          FileKind.Tenant,
        );
        if (logoDarkUpload)
          tenant.logoDark = logoDarkUpload.url;
      }

      await this.tenantRepository.flush();
      return tenant;
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

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Put(':id/logo')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async updateLogo(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ): Promise<ProfileImage> {
    return await this.tenantsService.setLogo(user, false, id, file);
  }

  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @Put(':id/logo-dark')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async updateLogoDark(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFile() file: MulterFile,
  ): Promise<ProfileImage> {
    return await this.tenantsService.setLogo(user, true, id, file);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async delete(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.delete(id);
  }
}
