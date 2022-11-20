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
import { CurrentUser } from '../../../shared/lib/decorators/current-user.decorator';
import { ContentListOptionsDto } from '../../../shared/lib/dto/list-options.dto';
import { Action, CheckPolicies } from '../../../shared/modules/authorization';
import { normalizePagination } from '../../../shared/modules/pagination';
import type { PaginatedResult } from '../../../shared/modules/pagination';
import { normalizeSort } from '../../../shared/modules/sorting';
import { User } from '../../../uua/users/user.entity';
import { Blog } from './blog.entity';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('Blogs')
@Controller({ path: 'blogs' })
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
  ) {}

  @Post()
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

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Blog))
  public async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
): Promise<Blog> {
    return await this.blogsService.findOne(user, id);
  }

  @Patch(':id')
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
