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
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateWikiPageDto } from '@create/wikis/dto/create-wiki-page.dto';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import { FilterAndPaginationArgs } from './dto/filter-and-paginate.dto';
import { UpdateWikiPageDto } from './dto/update-wiki-page.dto';
import { Wiki } from './wiki.entity';
import { WikisService } from './wikis.service';

@ApiTags('Wikis')
@Controller({ path: 'wikis' })
export class WikisController {
  constructor(
    private readonly wikisService: WikisService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Wiki))
  public async create(@Body() createWikiPageDto: CreateWikiPageDto): Promise<Wiki> {
    return await this.wikisService.create(createWikiPageDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Wiki))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: FilterAndPaginationArgs,
  ): Promise<PaginatedNodes<Wiki>> {
    if (query.category)
      return await this.wikisService.findAllByCategory(user, query.category, query);
    return await this.wikisService.findAll(user, query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Wiki))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Wiki | null> {
    return await this.wikisService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Wiki))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWikiPageDto: UpdateWikiPageDto,
  ): Promise<Wiki> {
    return await this.wikisService.update(id, updateWikiPageDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Wiki))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.wikisService.remove(id);
  }
}
