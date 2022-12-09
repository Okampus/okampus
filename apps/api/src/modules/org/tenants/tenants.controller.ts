import {
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
import { UploadInterceptor, UploadMultipleInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { TenantImageType } from '@common/lib/types/enums/tenant-image-type.enum';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { CreateTenantDto } from '@modules/org/tenants/dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import type { CreateTenantImageDto } from './tenant-images/dto/create-tenant-image.dto';
import { TenantImage } from './tenant-images/tenant-image.entity';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';

@ApiTags('Tenants')
@Controller()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Tenant))
  public async findOne(@Param('slug') slug: string): Promise<Tenant> {
    return await this.tenantsService.findOne(slug);
  }

  @UploadMultipleInterceptor(['logo', 'logoDark'])
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Tenant))
  public async create(
    @Body() createTenantDto: CreateTenantDto,
    @UploadedFiles() files: { logo?: MulterFile[]; logoDark?: MulterFile[] } | null,
  ): Promise<Tenant> {
    return await this.tenantsService.create(createTenantDto, files);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<Tenant> {
    return await this.tenantsService.update(id, updateTenantDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Tenant))
  public async delete(@Param('id') id: string): Promise<Tenant> {
    return await this.tenantsService.delete(id);
  }

  @Put(':id/logo')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, TenantImage),
    ability => ability.can(Action.Update, Tenant),
  )
  public async updateLogo(
    @UploadedFile() logo: MulterFile,
    @Body() createTeamImage: Omit<CreateTenantImageDto, 'type'>,
  ): Promise<Tenant> {
    return await this.tenantsService.addImage(logo, { ...createTeamImage, type: TenantImageType.Logo });
  }

  @Put(':id/logo-dark')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, TenantImage),
    ability => ability.can(Action.Update, Tenant),
  )
  public async updateLogoDark(
    @UploadedFile() logoDark: MulterFile,
    @Body() createTeamImage: Omit<CreateTenantImageDto, 'type'>,
  ): Promise<Tenant> {
    return await this.tenantsService.addImage(logoDark, { ...createTeamImage, type: TenantImageType.LogoDark });
  }
}
