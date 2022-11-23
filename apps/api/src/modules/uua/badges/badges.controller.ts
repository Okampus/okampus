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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { normalizePagination, PaginateDto } from '@common/modules/pagination';
import type { PaginatedResult } from '@common/modules/pagination';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import type { BadgeUnlock } from './entities/badge-unlock.entity';
import { Badge } from './entities/badge.entity';

@ApiTags('Badges')
@Controller({ path: 'badges' })
export class BadgesController {
  constructor(
    private readonly badgesService: BadgesService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Badge))
  public async create(@Body() createTagDto: CreateBadgeDto): Promise<Badge> {
    return await this.badgesService.create(createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Badge>> {
    return await this.badgesService.findAll(normalizePagination(query));
  }

  @Get('/user/:id')
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findAllForUser(
    @Param('id') id: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<BadgeUnlock>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.badgesService.findAllForUser(id, options);
    }
    return await this.badgesService.findAllForUser(id);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Badge))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Badge> {
    return await this.badgesService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Badge))
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateBadgeDto: UpdateBadgeDto): Promise<Badge> {
    return await this.badgesService.update(id, updateBadgeDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Badge))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.badgesService.remove(id);
  }
}
