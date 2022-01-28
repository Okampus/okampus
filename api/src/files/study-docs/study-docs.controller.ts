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
import { StudyDocCategoryType } from '../../shared/lib/types/docs-category.type';
import type { Category } from '../../shared/lib/types/docs-category.type';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../../shared/modules/search/search.dto';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CategoryTypesDto } from './dto/category-types.dto';
import { CreateStudyDocDto } from './dto/create-study-doc.dto';
import { DocsFilterDto } from './dto/docs-filter.dto';
import { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import { StudyDoc } from './study-doc.entity';
import type { IndexedStudyDoc } from './study-docs-search.service';
import { StudyDocSearchService } from './study-docs-search.service';
import { StudyDocsService } from './study-docs.service';

@ApiTags('StudyDocs')
@Controller()
export class StudyDocsController {
  constructor(
    private readonly studyDocsService: StudyDocsService,
    private readonly studyDocSearchService: StudyDocSearchService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, StudyDoc))
  public async createStudyDoc(
    @CurrentUser() user: User,
    @Body() createStudyDocDto: CreateStudyDocDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StudyDoc> {
    if (createStudyDocDto.flags && !createStudyDocDto.type.startsWith('exam'))
      throw new BadRequestException('Flags can only be set for exams');
    if (!createStudyDocDto.flags && createStudyDocDto.type.startsWith('exam'))
      throw new BadRequestException('Flags must be set for exams');
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.StudyDoc,
      createStudyDocDto.fileLastModifiedAt,
    );
    return await this.studyDocsService.create(createStudyDocDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async findAllStudyDocs(
    @Query() query: DocsFilterDto,
  ): Promise<PaginatedResult<StudyDoc>> {
    if (query.page)
      return await this.studyDocsService.findAll(query, { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.studyDocsService.findAll(query);
  }

  @Get('/categories')
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async findCategories(
    @Query() categoriesTypesDto: CategoryTypesDto,
  ): Promise<Array<Category<StudyDocCategoryType>>> {
    const defaultSort = [
      StudyDocCategoryType.SchoolYear,
      StudyDocCategoryType.Subject,
      StudyDocCategoryType.Type,
      StudyDocCategoryType.Year,
  ];
    return await this.studyDocsService.findCategories(categoriesTypesDto?.categories ?? defaultSort);
  }

  @UseGuards(TypesenseGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedStudyDoc> | SearchResponse<StudyDoc>> {
    if (full)
      return await this.studyDocSearchService.searchAndPopulate(query);
    return await this.studyDocSearchService.search(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async findOneStudyDoc(@Param('id') id: string): Promise<StudyDoc> {
    return await this.studyDocsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, StudyDoc))
  public async updateStudyDoc(
    @Param('id') id: string,
    @Body() updateStudyDocDto: UpdateStudyDocDto,
    @CurrentUser() user: User,
  ): Promise<StudyDoc> {
    return await this.studyDocsService.update(user, id, updateStudyDocDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Update, StudyDoc))
  public async removeStudyDoc(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.studyDocsService.remove(user, id);
  }
}
