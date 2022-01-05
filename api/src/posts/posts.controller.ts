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
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies, PoliciesGuard } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { VoteDto } from '../shared/modules/vote/vote.dto';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import type { NoPostVote, PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { PostVotesService } from './post-votes.service';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@UseGuards(PoliciesGuard)
@Controller({ path: 'posts' })
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postVotesService: PostVotesService,
  ) {}

  @PostRequest()
  @CheckPolicies(ability => ability.can(Action.Create, Post))
  public async create(@CurrentUser() user: User, @Body() createPostDto: CreatePostDto): Promise<Post> {
    return await this.postsService.create(user, createPostDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Post))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Post>> {
    if (query.page)
      return await this.postsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.postsService.findAll();
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Post))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Post> {
    return await this.postsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Post))
  public async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    return this.postsService.update(user, id, updatePostDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Post))
  public async remove(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.postsService.remove(user, id);
  }

  @Get(':id/vote')
  @CheckPolicies(ability => ability.can(Action.Read, Post))
  public async findVote(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NoPostVote | PostVote> {
    return await this.postVotesService.findVote(user, id);
  }

  @PostRequest(':id/vote')
  @CheckPolicies(ability => ability.can(Action.Interact, Post))
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
