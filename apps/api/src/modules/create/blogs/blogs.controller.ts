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
import { normalizeSort } from '@common/modules/sorting';
import { CreateBlogDto } from '@create/blogs/dto/create-blog.dto';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { ContentListOptionsDto } from '@lib/dto/list-options.dto';
import { User } from '@uaa/users/user.entity';
import { Blog } from './blog.entity';
import { BlogsService } from './blogs.service';
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
  ): Promise<PaginatedNodes<Blog>> {
    return await this.blogsService.findAll(user, { ...query, ...normalizeSort(query) });
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
