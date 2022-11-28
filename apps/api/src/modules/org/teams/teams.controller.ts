import {
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
import { MulterFile } from '@webundsoehne/nest-fastify-file-upload/dist/interfaces/multer-options.interface';
import { simpleImageMimeTypeRegex } from '@common/configs/mime-type';
import { CurrentTenant } from '@common/lib/decorators/current-tenant.decorator';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { UploadInterceptor } from '@common/lib/decorators/upload-interceptor.decorator';
import { TeamImageType } from '@common/lib/types/enums/team-image-type.enum';
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedResult } from '@common/modules/pagination';
import { normalizePagination } from '@common/modules/pagination';
import { CreateTeamDto } from '@modules/org/teams/dto/create-team.dto';
import { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';
import { User } from '@modules/uaa/users/user.entity';
import { Tenant } from '../tenants/tenant.entity';
import { TeamListOptions } from './dto/team-list-options.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import type { Social } from './socials/social.entity';
import type { CreateTeamImageDto } from './team-images/dto/create-team-image.dto';
import { TeamImage } from './team-images/team-image.entity';
import { Team } from './team.entity';
import { TeamsService } from './teams.service';

@ApiTags('Teams')
@Controller()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

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

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Team> {
    return await this.teamsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateSubjectDto: UpdateTeamDto): Promise<Team> {
    return await this.teamsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Team))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.teamsService.remove(id);
  }

  @Post(':id/social')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async addSocial(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() createSocialDto: CreateSocialDto,
  ): Promise<Social> {
    return await this.teamsService.addSocialAccount(user, id, createSocialDto);
  }

  @Put(':id/logo')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, TeamImage),
    ability => ability.can(Action.Update, Team),
  )
  public async updateLogo(
    @UploadedFile() logo: MulterFile,
    @Body() createTeamImage: Omit<CreateTeamImageDto, 'type'>,
  ): Promise<Team> {
    return await this.teamsService.addImage(logo, { ...createTeamImage, type: TeamImageType.Logo });
  }

  @Put(':id/logo-dark')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, TeamImage),
    ability => ability.can(Action.Update, Team),
  )
  public async updateLogoDark(
    @UploadedFile() logoDark: MulterFile,
    @Body() createTeamImage: Omit<CreateTeamImageDto, 'type'>,
  ): Promise<Team> {
    return await this.teamsService.addImage(logoDark, { ...createTeamImage, type: TeamImageType.LogoDark });
  }

  @Put(':id/banner')
  @UploadInterceptor({ mimeTypeRegex: simpleImageMimeTypeRegex })
  @CheckPolicies(
    ability => ability.can(Action.Create, TeamImage),
    ability => ability.can(Action.Update, Team),
  )
  public async updateBanner(
    @UploadedFile() banner: MulterFile,
    @Body() createTeamImage: Omit<CreateTeamImageDto, 'type'>,
  ): Promise<Team> {
    return await this.teamsService.addImage(banner, { ...createTeamImage, type: TeamImageType.Banner });
  }
}
