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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SerializerExcludeContentAuthor } from '../shared/lib/decorators/serializers.decorator';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../shared/modules/search/search.dto';
import { User } from '../users/user.entity';
import { AssigneesDto } from './dto/assignees.dto';
import { CreateThreadDto } from './dto/create-thread.dto';
import { TagsDto } from './dto/tags.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import type { ThreadInteractions } from './thread-interactions.interface';
import { ThreadSearchService } from './thread-search.service';
import type { IndexedThread } from './thread-search.service';
import { Thread } from './thread.entity';
import { ThreadsService } from './threads.service';

@ApiTags('Threads')
@Controller({ path: 'threads' })
export class ThreadsController {
  constructor(
    private readonly threadsService: ThreadsService,
    private readonly threadSearchService: ThreadSearchService,
  ) {}

  @Post()
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Create, Thread))
  public async create(@CurrentUser() user: User, @Body() createThreadDto: CreateThreadDto): Promise<Thread> {
    return await this.threadsService.create(user, createThreadDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Thread))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Thread>> {
    if (query.page)
      return await this.threadsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.threadsService.findAll();
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Thread))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedThread> | SearchResponse<Thread>> {
    if (full)
      return await this.threadSearchService.searchAndPopulate(query);
    return await this.threadSearchService.search(query);
  }

  @Get(':id')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Read, Thread))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Thread> {
    return await this.threadsService.findOne(id);
  }

  @Get(':id/interactions')
  @CheckPolicies(ability => ability.can(Action.Read, Thread))
  public async findInteractions(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ThreadInteractions> {
    return await this.threadsService.findInteractions(user, id);
  }

  @Patch(':id')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Update, Thread))
  public async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateThreadDto: UpdateThreadDto,
  ): Promise<Thread> {
    return this.threadsService.update(user, id, updateThreadDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Thread))
  public async remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.threadsService.remove(user, id);
  }

  @Post(':id/tags')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Interact, Thread))
  public async addTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() tagsDto: TagsDto,
  ): Promise<Thread> {
    return await this.threadsService.addTags(id, tagsDto.tags);
  }

  @Delete(':id/tags')
  @CheckPolicies(ability => ability.can(Action.Interact, Thread))
  public async removeTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() tagsDto: TagsDto,
  ): Promise<void> {
    await this.threadsService.removeTags(id, tagsDto.tags);
  }

  @Post(':id/assignees')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Interact, Thread))
  public async addAssignees(
    @Param('id', ParseIntPipe) id: number,
    @Body() assigneesDto: AssigneesDto,
  ): Promise<Thread> {
    return await this.threadsService.addAssignees(id, assigneesDto.assignees);
  }

  @Delete(':id/assignees')
  @CheckPolicies(ability => ability.can(Action.Interact, Thread))
  public async removeAssignees(
    @Param('id', ParseIntPipe) id: number,
    @Body() assigneesDto: AssigneesDto,
  ): Promise<void> {
    await this.threadsService.removeAssignees(id, assigneesDto.assignees);
  }
}
