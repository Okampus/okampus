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
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/file-kind.enum';
import { Action, CheckPolicies, PoliciesGuard } from '../../shared/modules/authorization';
import { PaginateDto } from '../../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateStudyDocDto } from './dto/create-study-doc.dto';
import { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import { StudyDoc } from './study-doc.entity';
import { StudyDocsService } from './study-docs.service';

@ApiTags('StudyDocs')
@UseGuards(PoliciesGuard)
@Controller({ path: 'files/study-docs' })
export class StudyDocsController {
  constructor(
    private readonly studyDocsService: StudyDocsService,
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
  public async findAllStudyDocs(@Query() query: PaginateDto): Promise<PaginatedResult<StudyDoc>> {
    if (query.page)
      return await this.studyDocsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.studyDocsService.findAll();
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
