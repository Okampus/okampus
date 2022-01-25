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
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { User } from '../users/user.entity';
import { Content } from './content.entity';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { ParentDto } from './dto/parent.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('Contents')
@Controller({ path: 'contents' })
export class ContentsController {
  constructor(
    private readonly contentsService: ContentsService,
  ) {}

  @Post('replies')
  @CheckPolicies(ability => ability.can(Action.Create, Content))
  public async createReply(
    @Body() createContentDto: CreateContentDto,
    @CurrentUser() user: User,
  ): Promise<Content> {
    return await this.contentsService.createReply(user, createContentDto);
  }

  @Post('comments')
  @CheckPolicies(ability => ability.can(Action.Create, Content))
  public async createComment(
    @Body() createContentDto: CreateContentDto,
    @CurrentUser() user: User,
  ): Promise<Content> {
    return await this.contentsService.createComment(user, createContentDto);
  }

  @Get('replies')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findAllReplies(
    @Query() query: PaginateDto,
    @Body() parentDto: ParentDto,
  ): Promise<PaginatedResult<Content>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.contentsService.findAllReplies(parentDto.parentId, options);
    }
    return await this.contentsService.findAllReplies(parentDto.parentId);
  }

  @Get('comments')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findAllComments(
    @Query() query: PaginateDto,
    @Body() parentDto: ParentDto,
  ): Promise<PaginatedResult<Content>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.contentsService.findAllComments(parentDto.parentId, options);
    }
    return await this.contentsService.findAllComments(parentDto.parentId);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Content> {
    return await this.contentsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Content))
  public async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
    @CurrentUser() user: User,
  ): Promise<Content> {
    return await this.contentsService.update(user, id, updateContentDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Content))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contentsService.remove(user, id);
  }
}
