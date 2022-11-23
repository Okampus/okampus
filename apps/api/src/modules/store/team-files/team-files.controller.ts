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
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { Tenant } from '@modules/org/tenants/tenant.entity';
import { CreateTeamFileDto } from '@modules/store/team-files/dto/create-team-file.dto';
import { User } from '@modules/uua/users/user.entity';
import { FileUploadsService } from '../file-uploads/file-uploads.service';
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
    @CurrentTenant() tenant: Tenant,
    @CurrentUser() user: User,
    @Body() createTeamFile: CreateTeamFileDto,
    @UploadedFile() file: MulterFile,
  ): Promise<TeamFile> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(
      tenant,
      user,
      file,
      FileKind.TeamFile,
      createTeamFile.fileLastModifiedAt,
    );
    return await this.teamFilesService.create(user, createTeamFile, fileUpload);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, TeamFile))
  public async findAll(
    @Query() options: TeamFileListOptions,
  ): Promise<PaginatedResult<TeamFile>> {
    return await this.teamFilesService.findAll(normalizePagination(options));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, TeamFile))
  public async findOne(
    @Param('id') id: string,
  ): Promise<TeamFile> {
    return await this.teamFilesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, TeamFile))
  public async update(
    @Param('id') id: string,
    @Body() updateGalleryImageDto: UpdateTeamFileDto,
    @CurrentUser() user: User,
  ): Promise<TeamFile> {
    return await this.teamFilesService.update(user, id, updateGalleryImageDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, TeamFile))
  public async remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.teamFilesService.remove(user, id);
  }
}
