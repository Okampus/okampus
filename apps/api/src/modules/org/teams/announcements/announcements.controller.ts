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
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { CreateAnnouncementDto } from '@modules/org/teams/announcements/dto/create-announcement.dto';
import { User } from '@modules/uua/users/user.entity';
import { Announcement } from './announcement.entity';
import { AnnouncementsService } from './announcements.service';
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

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Announcement))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Announcement> {
    return await this.announcementsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Announcement))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    return await this.announcementsService.update(id, updateAnnouncementDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Announcement))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.announcementsService.remove(id);
  }
}
