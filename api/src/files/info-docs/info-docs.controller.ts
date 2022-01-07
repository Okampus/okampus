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
import { CreateInfoDocDto } from './dto/create-info-doc.dto';
import { UpdateInfoDocDto } from './dto/update-info-doc.dto';
import { InfoDoc } from './info-doc.entity';
import { InfoDocsService } from './info-docs.service';

@ApiTags('InfoDocs')
@UseGuards(PoliciesGuard)
@Controller({ path: 'files/info-docs' })
export class InfoDocsController {
  constructor(
    private readonly infoDocsService: InfoDocsService,
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
  public async findAllInfoDocs(@Query() query: PaginateDto): Promise<PaginatedResult<InfoDoc>> {
    if (query.page)
      return await this.infoDocsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.infoDocsService.findAll();
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
