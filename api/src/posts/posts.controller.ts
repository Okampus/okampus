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
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { VoteDto } from '../shared/dto/vote.dto';
import { PostInterceptor } from '../shared/interceptors/post.interceptor';
import { PostsInterceptor } from '../shared/interceptors/posts.interceptor';
import type { CustomPaginateResult, CustomPaginationResponse } from '../shared/pagination';
import { User } from '../users/user.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginateDto } from './dto/paginate.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostVotesService } from './post-votes.service';
import { PostsService } from './posts.service';
import type { Post } from './schemas/post.schema';

@UseGuards(JwtAuthGuard)
@Controller({ path: 'posts' })
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postVotesService: PostVotesService,
  ) {}

  @UseInterceptors(PostInterceptor)
  @PostRequest()
  public async create(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsService.create(user, createPostDto);
  }

  @UseInterceptors(PostsInterceptor)
  @Get()
  public async findAll(@Query() query: PaginateDto): Promise<CustomPaginationResponse<Post>> {
    if (query.page) {
      return await this.postsService.findAll({
        page: query.page,
        itemsPerPage: query.itemsPerPage ?? 10,
      }) as CustomPaginateResult<Post>;
    }

    const items = await this.postsService.findAll() as Post[];
    return { items };
  }

  @UseInterceptors(PostInterceptor)
  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return await this.postsService.findOne(id);
  }

  @UseInterceptors(PostInterceptor)
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

  @UseInterceptors(PostInterceptor)
  @PostRequest(':id/vote')
  public async vote(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() voteDto: VoteDto,
  ): Promise<Post> {
    switch (voteDto.value) {
      case -1:
        return await this.postVotesService.downvote(user, id);
      case 0:
        return await this.postVotesService.neutralize(user, id);
      case 1:
        return await this.postVotesService.upvote(user, id);
    }
  }
}
