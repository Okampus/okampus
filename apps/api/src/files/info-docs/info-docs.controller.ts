import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { InfoDocFilter } from '../../shared/lib/types/enums/docs-filters.enum';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import type { Categories } from '../../shared/lib/utils/compute-document-categories';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CategoryTypesDto } from './dto/category-types.dto';
import { CreateInfoDocDto } from './dto/create-info-doc.dto';
import { DocsFilterDto } from './dto/docs-filter.dto';
import { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';
import { InfoDocsService } from './info-docs.service';

@ApiTags('InfoDocs')
@Controller()
export class InfoDocsController {
  constructor(
    private readonly infoDocsService: InfoDocsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, InfoDoc))
  public async createInfoDoc(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createInfoDocDto: CreateInfoDocDto,
    @UploadedFile() file: MulterFile,
  ): Promise<InfoDoc> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.InfoDoc,
      createInfoDocDto.fileLastModifiedAt,
    );
    return await this.infoDocsService.create(createInfoDocDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async findAllInfoDocs(
    @Query() query: DocsFilterDto,
  ): Promise<PaginatedResult<InfoDoc>> {
    return await this.infoDocsService.findAll(query, normalizePagination(query));
  }

  @Get('/categories')
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async findCategories(
    @Query() categoriesTypesDto: CategoryTypesDto,
  ): Promise<Categories<InfoDoc>> {
    const defaultSort = [InfoDocFilter.Year];
    return await this.infoDocsService.findCategories(categoriesTypesDto?.categories ?? defaultSort);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async findOneInfoDoc(@Param('id') id: string): Promise<InfoDoc> {
    return await this.infoDocsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, InfoDoc))
  public async updateInfoDoc(
    @Param('id') id: string,
    @Body() updateInfoDocDto: UpdateInfoDocDto,
    @CurrentUser() user: User,
  ): Promise<InfoDoc> {
    return await this.infoDocsService.update(user, id, updateInfoDocDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, InfoDoc))
  public async removeInfoDoc(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.infoDocsService.remove(user, id);
  }
}
