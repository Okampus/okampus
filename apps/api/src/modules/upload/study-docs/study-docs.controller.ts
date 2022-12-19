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
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CurrentTenant } from '@lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { UploadInterceptor } from '@lib/decorators/upload-interceptor.decorator';
import { StudyDocFilter } from '@lib/types/enums/docs-filters.enum';
import { FileKind } from '@lib/types/enums/file-kind.enum';
import type { Categories } from '@lib/utils/compute-document-categories';
import { Tenant } from '@tenants/tenant.entity';
import { User } from '@uaa/users/user.entity';
import { FileUploadsService } from '@upload/file-uploads/file-uploads.service';
import { CreateStudyDocDto } from '@upload/study-docs/dto/create-study-doc.dto';
import { CategoryTypesDto } from './dto/category-types.dto';
import { DocsFilterDto } from './dto/docs-filter.dto';
import { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import { StudyDoc } from './study-doc.entity';
import { StudyDocsService } from './study-docs.service';

@ApiTags('StudyDocs')
@Controller()
export class StudyDocsController {
  constructor(
    private readonly studyDocsService: StudyDocsService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, StudyDoc))
  public async createStudyDoc(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createStudyDocDto: CreateStudyDocDto,
    @UploadedFile() file: MulterFile,
  ): Promise<StudyDoc> {
    if (createStudyDocDto.flags && !createStudyDocDto.type.startsWith('exam'))
      throw new BadRequestException('Flags can only be set for exams');
    if (!createStudyDocDto.flags && createStudyDocDto.type.startsWith('exam'))
      throw new BadRequestException('Flags must be set for exams');
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.Document,
      createStudyDocDto.fileLastModifiedAt,
    );
    return await this.studyDocsService.create(createStudyDocDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async findAllStudyDocs(
    @Query() query: DocsFilterDto,
  ): Promise<PaginatedNodes<StudyDoc>> {
    return await this.studyDocsService.findAll(query, query);
  }

  @Get('/categories')
  @CheckPolicies(ability => ability.can(Action.Read, StudyDoc))
  public async findCategories(
    @Query() categoriesTypesDto: CategoryTypesDto,
  ): Promise<Categories<StudyDoc>> {
    const defaultSort = [
      StudyDocFilter.Subject,
      StudyDocFilter.Type,
      StudyDocFilter.Year,
    ];
    return await this.studyDocsService.findCategories(categoriesTypesDto?.categories ?? defaultSort);
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
