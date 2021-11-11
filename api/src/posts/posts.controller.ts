import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as PostRequest,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import type { CustomPaginateResult } from '../shared/lib/pagination';
import { labelize } from '../shared/lib/pagination';
import { VoteDto } from '../shared/modules/vote/vote.dto';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginateDto } from './dto/paginate.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { Post } from './entities/post.entity';
import { PostVotesService } from './post-votes.service';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'posts' })
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postVotesService: PostVotesService,
  ) {}

  @PostRequest()
  public async create(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsService.create(user, createPostDto);
  }

  @Get()
  public async findAll(@Query() query: PaginateDto): Promise<CustomPaginateResult<Post>> {
    if (query.page) {
      const limit = query.itemsPerPage ?? 10;
      const offset = (query.page - 1) * limit;
      const { items, total } = await this.postsService.findAll({ offset, limit });
      return labelize(items, { offset, itemsPerPage: limit, total });
    }
    const { items, total } = await this.postsService.findAll();
    return labelize(items, { offset: 0, itemsPerPage: items.length, total });
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  public async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    return this.postsService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  public async remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.remove(user, id);
  }

  @PostRequest(':id/vote')
  public async vote(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() voteDto: VoteDto,
  ): Promise<Post> {
    if (voteDto.value === 0)
      return await this.postVotesService.neutralize(user, id);
    return await this.postVotesService.update(user, id, voteDto.value);
  }
}
