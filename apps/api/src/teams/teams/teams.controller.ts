import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import { FileUploadsService } from '../../files/file-uploads/file-uploads.service';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesService } from '../../files/profile-images/profile-images.service';
import { simpleImageMimeTypeRegex } from '../../shared/configs/mime-type';
import { CurrentTenant } from '../../shared/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { normalizePagination } from '../../shared/modules/pagination';
import { Tenant } from '../../tenants/tenants/tenant.entity';
import { User } from '../../users/user.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamListOptions } from './dto/team-list-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller()
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly profileImagesService: ProfileImagesService,
    private readonly filesService: FileUploadsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Team))
  public async create(
    @Body() createTagDto: CreateTeamDto,
    @CurrentUser() user: User,
    @CurrentTenant() tenant: Tenant,
  ): Promise<Team> {
    return await this.teamsService.create(tenant, user, createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findAll(
    @Query() options: TeamListOptions,
    ): Promise<PaginatedResult<Team>> {
    const teams = await this.teamsService.findAll(options, normalizePagination(options));
    return teams;
  }

  @Get('/names')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findNames(): Promise<Array<Pick<Team, 'avatar' | 'id' | 'name'>>> {
    return await this.teamsService.findNames();
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return await this.teamsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubjectDto: UpdateTeamDto,
    @CurrentUser() requester: User,
  ): Promise<Team> {
    return await this.teamsService.update(requester, id, updateSubjectDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Team))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.teamsService.remove(id);
  }

  @Put(':id/avatar')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(ability => ability.can(Action.Create, ProfileImage))
  public async updateAvatar(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Team> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user, file, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    return await this.teamsService.updateProfileImage(user, id, 'avatar', profileImage);
  }

  @Put(':id/banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, ProfileImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateBanner(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() banner: Express.Multer.File,
  ): Promise<Team> {
    if (!banner)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user, banner, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    return await this.teamsService.updateProfileImage(user, id, 'banner', profileImage);
  }
}
