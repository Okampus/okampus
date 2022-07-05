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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Express } from 'express';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { FileUploadsService } from '../../files/file-uploads/file-uploads.service';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { ProfileImagesService } from '../../files/profile-images/profile-images.service';
import { simpleImageMimeTypeRegex } from '../../shared/configs/mime-type';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { SerializerIncludeTeamForm, SerializerIncludeTeamMembers } from '../../shared/lib/decorators/serializers.decorator';
import { UploadInterceptor } from '../../shared/lib/decorators/upload-interceptor.decorator';
import { TypesenseEnabledGuard } from '../../shared/lib/guards/typesense-enabled.guard';
import { FileKind } from '../../shared/lib/types/enums/file-kind.enum';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { SearchDto } from '../../shared/modules/search/search.dto';
import { User } from '../../users/user.entity';
import { TeamListOptions } from '../dto/team-list-options.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { IndexedTeam } from './team-search.service';
import { TeamSearchService } from './team-search.service';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller()
@SerializerIncludeTeamForm()
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
    private readonly profileImagesService: ProfileImagesService,
    private readonly filesService: FileUploadsService,

    private readonly teamSearchService: TeamSearchService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Team))
  @SerializerIncludeTeamMembers()
  public async create(
    @Body() createTagDto: CreateTeamDto,
    @CurrentUser() user: User,
  ): Promise<Team> {
    return await this.teamsService.create(user, createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerIncludeTeamMembers()
  public async findAll(
    @Query() options: TeamListOptions,
    ): Promise<PaginatedResult<Team>> {
    return await this.teamsService.findAll(options, normalizePagination(options));
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedTeam> | SearchResponse<Team>> {
    if (full)
      return await this.teamSearchService.searchAndPopulate(query);
    return await this.teamSearchService.search(query);
  }

  @Get('/names')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findNames(): Promise<Array<Pick<Team, 'avatar' | 'name' | 'teamId'>>> {
    return await this.teamsService.findNames();
  }

  @Get(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerIncludeTeamMembers()
  public async findOne(@Param('teamId', ParseIntPipe) teamId: number): Promise<Team> {
    return await this.teamsService.findOne(teamId);
  }

  @Patch(':teamId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerIncludeTeamMembers()
  public async update(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() updateSubjectDto: UpdateTeamDto,
    @CurrentUser() requester: User,
  ): Promise<Team> {
    return await this.teamsService.update(requester, teamId, updateSubjectDto);
  }

  @Delete(':teamId')
  @CheckPolicies(ability => ability.can(Action.Delete, Team))
  @SerializerIncludeTeamMembers()
  public async remove(@Param('teamId', ParseIntPipe) teamId: number): Promise<void> {
    await this.teamsService.remove(teamId);
  }

  @Put(':teamId/avatar')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(ability => ability.can(Action.Create, ProfileImage))
  public async updateAvatar(
    @CurrentUser() user: User,
    @Param('teamId', ParseIntPipe) teamId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Team> {
    if (!file)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user, file, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    console.log('oiuiii');
    return await this.teamsService.updateProfileImage(user, teamId, 'avatar', profileImage);
  }

  @Put(':teamId/banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, ProfileImage),
    ability => ability.can(Action.Update, User),
  )
  public async updateBanner(
    @CurrentUser() user: User,
    @Param('teamId', ParseIntPipe) teamId: number,
    @UploadedFile() banner: Express.Multer.File,
  ): Promise<Team> {
    if (!banner)
      throw new BadRequestException('No file provided');

    const fileUpload = await this.filesService.create(user, banner, FileKind.ProfileImage);
    const profileImage = await this.profileImagesService.create(fileUpload);

    return await this.teamsService.updateProfileImage(user, teamId, 'banner', profileImage);
  }
}
