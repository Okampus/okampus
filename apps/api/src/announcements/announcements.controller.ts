import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { User } from '../users/user.entity';
import { Announcement } from './announcement.entity';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import ListAnnouncementsDto from './dto/list-announcements.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Announcements')
@Controller({ path: 'announcements' })
export class AnnouncementsController {
  constructor(
    private readonly announcementsService: AnnouncementsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Announcement))
  public async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() user: User,
  ): Promise<Announcement> {
    return await this.announcementsService.create(user, createAnnouncementDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Announcement))
  public async findAllCurrent(
    @Query() query: ListAnnouncementsDto,
    @CurrentUser() user: User,
  ): Promise<PaginatedResult<Announcement>> {
    return await this.announcementsService.findAll(user, query, normalizePagination(query));
  }

  @Get(':announcementId')
  @CheckPolicies(ability => ability.can(Action.Read, Announcement))
  public async findOne(
    @Param('announcementId', ParseIntPipe) announcementId: number,
    @CurrentUser() user: User,
  ): Promise<Announcement> {
    return await this.announcementsService.findOne(user, announcementId);
  }

  @Patch(':announcementId')
  @CheckPolicies(ability => ability.can(Action.Update, Announcement))
  public async update(
    @Param('announcementId', ParseIntPipe) announcementId: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return await this.announcementsService.update(announcementId, updateAnnouncementDto);
  }

  @Delete(':announcementId')
  @CheckPolicies(ability => ability.can(Action.Delete, Announcement))
  public async remove(
    @Param('announcementId', ParseIntPipe) announcementId: number,
  ): Promise<void> {
    await this.announcementsService.remove(announcementId);
  }
}
