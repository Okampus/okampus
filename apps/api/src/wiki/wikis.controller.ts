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
import { CreateWikiPageDto } from './dto/create-wiki-page.dto';
import { FilterAndPaginateDto } from './dto/filter-and-paginate.dto';
import { UpdateWikiPageDto } from './dto/update-wiki-page.dto';
import { WikiPage } from './wiki-page.entity';
import { WikisService } from './wikis.service';

@ApiTags('Wikis')
@Controller({ path: 'wikis' })
export class WikisController {
  constructor(
    private readonly wikisService: WikisService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, WikiPage))
  public async create(@Body() createWikiPageDto: CreateWikiPageDto): Promise<WikiPage> {
    return await this.wikisService.create(createWikiPageDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, WikiPage))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: FilterAndPaginateDto,
  ): Promise<PaginatedResult<WikiPage>> {
    if (query.category)
      return await this.wikisService.findAllByCategory(user, query.category, normalizePagination(query));
    return await this.wikisService.findAll(user, normalizePagination(query));
  }

  @Get(':wikiPageId')
  @CheckPolicies(ability => ability.can(Action.Read, WikiPage))
  public async findOne(@Param('wikiPageId', ParseIntPipe) wikiPageId: number): Promise<WikiPage | null> {
    return await this.wikisService.findOne(wikiPageId);
  }

  @Patch(':wikiPageId')
  @CheckPolicies(ability => ability.can(Action.Update, WikiPage))
  public async update(@Param('wikiPageId', ParseIntPipe) wikiPageId: number, @Body() updateWikiPageDto: UpdateWikiPageDto): Promise<WikiPage> {
    return await this.wikisService.update(wikiPageId, updateWikiPageDto);
  }

  @Delete(':wikiPageId')
  @CheckPolicies(ability => ability.can(Action.Delete, WikiPage))
  public async remove(@Param('wikiPageId', ParseIntPipe) wikiPageId: number): Promise<void> {
    await this.wikisService.remove(wikiPageId);
  }
}
