import { createReadStream, promises as fs, constants as fsConst } from 'node:fs';
import path from 'node:path';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response as Res } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { config } from '../config';
import { PaginateDto } from '../posts/dto/paginate.dto';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import type { CustomPaginateResult } from '../shared/lib/pagination';
import { labelize } from '../shared/lib/pagination';
import { FileKind } from '../shared/lib/types/file-kind.enum';
import { User } from '../users/user.entity';
import { CreateStudyDocDto } from './dto/create-study-doc.dto';
import { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import type { StudyDoc } from './entities/study-doc.entity';
import { FilesService } from './services/file-uploads.service';
import { StudyDocsService } from './services/study-docs.service';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'files' })
export class FilesController {
  constructor(
    private readonly studyDocsService: StudyDocsService,
    private readonly filesService: FilesService,
  ) {}

  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: config.get('uploadMaxSize') } }))
  @Post('/study-docs')
  public async uploadCourseDocument(
    @CurrentUser() user: User,
    @Body() createStudyDocDto: CreateStudyDocDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StudyDoc> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.StudyDocs,
      createStudyDocDto.fileLastModifiedAt,
    );
    return await this.studyDocsService.create(createStudyDocDto, fileUpload);
  }

  @Get('/study-docs')
  public async getAllUploads(@Query() query: PaginateDto): Promise<CustomPaginateResult<StudyDoc>> {
    if (query.page) {
      const limit = query.itemsPerPage ?? 10;
      const offset = (query.page - 1) * limit;
      const { items, total } = await this.studyDocsService.findAll({ offset, limit });
      return labelize(items, { offset, itemsPerPage: limit, total });
    }
    const { items, total } = await this.studyDocsService.findAll();
    return labelize(items, { offset: 0, itemsPerPage: items.length, total });
  }

  @Get(':id')
  public async getOne(@Param('id', ParseIntPipe) id: number): Promise<StudyDoc> {
    return await this.studyDocsService.findOne(id);
  }

  @Patch(':id')
  public async updateDoc(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDocDto: UpdateStudyDocDto,
  ): Promise<StudyDoc> {
    return await this.studyDocsService.update(user, id, updateCourseDocDto);
  }

  @Get('/download/:id')
  public async getFile(
    @Param('id', ParseIntPipe) id: number,
    @Response({ passthrough: true }) res: Res,
  ): Promise<StreamableFile> {
    const fileDocument = await this.filesService.getUploadById(id);
    if (!fileDocument)
      throw new NotFoundException('File not found');

    const filePath = path.join(config.get('uploadPath'), fileDocument?.fileKind, fileDocument.fileUploadId.toString());
    res.set({
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': fileDocument.mimeType,
      'Content-Disposition': `attachment; filename="${fileDocument.originalName}"`,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    return await fs.access(filePath, fsConst.F_OK)
      .then(() => new StreamableFile(createReadStream(filePath)))
      .catch(() => { throw new InternalServerErrorException('File cannot be read'); });
  }
}
