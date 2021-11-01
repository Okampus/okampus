import { createReadStream, promises as fs, constants as fsConst } from 'node:fs';
import { join } from 'node:path';
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
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import type { CustomPaginateResult, CustomPaginationResponse } from '../shared/pagination';
import { FileType } from '../shared/types/file-kinds.enum';
import { User } from '../users/user.schema';
import { CreateStudyDocDto } from './dto/create-study-doc.dto';
import { UpdateStudyDocDto } from './dto/update-study-doc.dto';
import type { StudyDoc } from './schemas/study-doc.schema';
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
    @Body() body: CreateStudyDocDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StudyDoc> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileDocument = await this.filesService.create(user, file, FileType.StudyDocs, body.fileLastModifiedAt);

    return await this.studyDocsService.create(body, fileDocument);
  }

  @Get('/study-docs')
  public async getAllUploads(@Query() query: PaginateDto): Promise<CustomPaginationResponse<StudyDoc>> {
    if (query.page) {
      return await this.studyDocsService.findAll({
        page: query.page,
        itemsPerPage: query.itemsPerPage ?? 10,
      }) as CustomPaginateResult<StudyDoc>;
    }
    const items = await this.studyDocsService.findAll() as StudyDoc[];
    return { items };
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
    @Param('id', ParseIntPipe) id: string,
    @Response({ passthrough: true }) res: Res,
  ): Promise<StreamableFile> {
    const fileDocument = await this.filesService.getUploadById(id);
    if (!fileDocument)
      throw new NotFoundException('File not found');

    const filePath = join(config.get('uploadPath'), fileDocument?.fileKind, fileDocument._id.toString());
    res.set({
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': fileDocument.type,
      'Content-Disposition': `attachment; filename="${fileDocument.originalName}"`,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    return await fs.access(filePath, fsConst.F_OK)
      .then(() => new StreamableFile(createReadStream(filePath)))
      .catch(() => { throw new InternalServerErrorException('File cannot be read'); });
  }
}
