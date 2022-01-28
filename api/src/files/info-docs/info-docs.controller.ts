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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { TypesenseGuard } from '../../shared/lib/guards/typesense.guard';
import type { Category } from '../../shared/lib/types/docs-category.type';
import { InfoDocCategoryType } from '../../shared/lib/types/docs-category.type';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../../shared/modules/search/search.dto';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CategoryTypesDto } from './dto/category-types.dto';
import { CreateInfoDocDto } from './dto/create-info-doc.dto';
import { DocsFilterDto } from './dto/docs-filter.dto';
import { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';
import type { IndexedInfoDoc } from './info-docs-search.service';
import { InfoDocSearchService } from './info-docs-search.service';
import { InfoDocsService } from './info-docs.service';

@ApiTags('InfoDocs')
@Controller()
export class InfoDocsController {
  constructor(
    private readonly infoDocsService: InfoDocsService,
    private readonly infoDocSearchService: InfoDocSearchService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, InfoDoc))
  public async createInfoDoc(
    @CurrentUser() user: User,
    @Body() createInfoDocDto: CreateInfoDocDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<InfoDoc> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.InfoDoc,
      createInfoDocDto.fileLastModifiedAt,
    );
    return await this.infoDocsService.create(createInfoDocDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async findAllInfoDocs(@Query() query: DocsFilterDto): Promise<PaginatedResult<InfoDoc>> {
    if (query.page)
      return await this.infoDocsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.infoDocsService.findAll();
  }

  @Get('/categories')
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async findCategories(
    @Query() categoriesTypesDto: CategoryTypesDto,
  ): Promise<Array<Category<InfoDocCategoryType>>> {
    const defaultSort = [
      InfoDocCategoryType.SchoolYear,
      InfoDocCategoryType.Year,
  ];
    return await this.infoDocsService.findCategories(categoriesTypesDto?.categories ?? defaultSort);
  }

  @UseGuards(TypesenseGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, InfoDoc))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedInfoDoc> | SearchResponse<InfoDoc>> {
    if (full)
      return await this.infoDocSearchService.searchAndPopulate(query);
    return await this.infoDocSearchService.search(query);
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
