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
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { InfoDocFilter } from '@common/lib/types/enums/docs-filters.enum';
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import type { Categories } from '@common/lib/utils/compute-document-categories';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateInfoDocDto } from '@modules/upload/info-docs/dto/create-info-doc.dto';
import { User } from '@modules/uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CategoryTypesDto } from './dto/category-types.dto';
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
