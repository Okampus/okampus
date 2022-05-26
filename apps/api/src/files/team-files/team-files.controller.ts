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
import { Express } from 'express';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { CreateTeamFileDto } from './dto/create-team-file.dto';
import { TeamFileListOptions } from './dto/team-file-list-options.dto';
import { UpdateTeamFileDto } from './dto/update-team-file.dto';
import { TeamFile } from './team-file.entity';
import { TeamFilesService } from './team-files.service';

@ApiTags('TeamFiles')
@Controller()
export class TeamFilesController {
  constructor(
    private readonly teamFilesService: TeamFilesService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamFile))
  public async create(
    @CurrentUser() user: User,
    @Body() createAttachmentDto: CreateTeamFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TeamFile> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      user,
      file,
      FileKind.TeamFile,
      createAttachmentDto.fileLastModifiedAt,
    );
    return await this.teamFilesService.create(user, createAttachmentDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamFile))
  public async findAll(
    @Query() options: TeamFileListOptions,
  ): Promise<PaginatedResult<TeamFile>> {
    return await this.teamFilesService.findAll(normalizePagination(options));
  }

  @Get(':imageId')
  @CheckPolicies(ability => ability.can(Action.Read, TeamFile))
  public async findOne(
    @Param('imageId') imageId: string,
  ): Promise<TeamFile> {
    return await this.teamFilesService.findOne(imageId);
  }

  @Patch(':imageId')
  @CheckPolicies(ability => ability.can(Action.Update, TeamFile))
  public async update(
    @Param('imageId') imageId: string,
    @Body() updateGalleryImageDto: UpdateTeamFileDto,
    @CurrentUser() user: User,
  ): Promise<TeamFile> {
    return await this.teamFilesService.update(user, imageId, updateGalleryImageDto);
  }

  @Delete(':imageId')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamFile))
  public async remove(
    @Param('imageId') imageId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFilesService.remove(user, imageId);
  }
}
