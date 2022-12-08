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
import { FileKind } from '@common/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedNodes } from '@common/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { User } from '@modules/uaa/users/user.entity';
import { CreateTeamGalleryDto } from '@modules/upload/team-galleries/dto/create-team-gallery.dto';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
import { TeamGalleryListOptions } from './dto/team-gallery-list-options.dto';
import { UpdateTeamGalleryDto } from './dto/update-team-gallery.dto';
import { TeamGallery } from './team-gallery.entity';
import { TeamGalleriesService } from './team-gallery.service';

@ApiTags('TeamGallerys')
@Controller()
export class TeamGalleriesController {
  constructor(
    private readonly teamFilesService: TeamGalleriesService,
    private readonly filesService: FileUploadsService,
  ) {}

  @UploadInterceptor()
  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, TeamGallery))
  public async create(
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createAttachmentDto: CreateTeamGalleryDto,
    @UploadedFile() file: MulterFile,
  ): Promise<TeamGallery> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.TeamGallery,
      createAttachmentDto.fileLastModifiedAt,
    );
    return await this.teamFilesService.create(user, createAttachmentDto, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamGallery))
  public async findAll(
    @Query() options: TeamGalleryListOptions,
  ): Promise<PaginatedNodes<TeamGallery>> {
    return await this.teamFilesService.findAll(options);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamGallery))
  public async findOne(
    @Param('id') id: string,
  ): Promise<TeamGallery> {
    return await this.teamFilesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamGallery))
  public async update(
    @Param('id') id: string,
    @Body() updateGalleryImageDto: UpdateTeamGalleryDto,
    @CurrentUser() user: User,
  ): Promise<TeamGallery> {
    return await this.teamFilesService.update(user, id, updateGalleryImageDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamGallery))
  public async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFilesService.remove(user, id);
  }
}