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
import { ContentListOptionsDto } from '../shared/lib/dto/list-options.dto';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import { normalizeSort } from '../shared/modules/sorting';
import { User } from '../users/user.entity';
import type { IndexedBlog } from './blog-search.service';
import { BlogSearchService } from './blog-search.service';
import { Blog } from './blog.entity';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller({ path: 'blogs' })
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogSearchService: BlogSearchService,
  ) {}

  @Post()
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Create, Blog))
  public async create(@CurrentUser() user: User, @Body() createBlogDto: CreateBlogDto): Promise<Blog> {
    return await this.blogsService.create(user, createBlogDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Blog))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ContentListOptionsDto,
  ): Promise<PaginatedResult<Blog>> {
    return await this.blogsService.findAll(user, { ...normalizePagination(query), ...normalizeSort(query) });
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Blog))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<Blog> | SearchResponse<IndexedBlog>> {
    if (full)
      return await this.blogSearchService.searchAndPopulate(query);
    return await this.blogSearchService.search(query);
  }

  @Get(':id')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Read, Blog))
  public async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
): Promise<Blog> {
    return await this.blogsService.findOne(user, id);
  }

  @Patch(':id')
  @SerializerExcludeContentAuthor()
  @CheckPolicies(ability => ability.can(Action.Update, Blog))
  public async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogsService.update(user, id, updateBlogDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Blog))
  public async remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.blogsService.remove(user, id);
  }
}
