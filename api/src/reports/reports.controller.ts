import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { Article } from '../articles/entities/article.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Post as PostEntity } from '../posts/entities/post.entity';
import { Reply } from '../replies/entities/reply.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { TypesenseGuard } from '../shared/lib/guards/typesense.guard';
import type { PolicyHandler } from '../shared/modules/authorization';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import type { AppAbility } from '../shared/modules/casl/casl-ability.factory';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../shared/modules/search/search.dto';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ArticleReport } from './entities/article-report.entity';
import { CommentReport } from './entities/comment-report.entity';
import { PostReport } from './entities/post-report.entity';
import { ReplyReport } from './entities/reply-report.entity';
import type { Report } from './entities/report.entity';
import { ReportsService } from './reports.service';
import { ArticleReportsService } from './services/article-reports.service';
import { CommentReportsService } from './services/comment-reports.service';
import { PostReportsService } from './services/post-reports.service';
import { ReplyReportsService } from './services/reply-reports.service';
import type { IndexedReport } from './services/report-search.service';
import { ReportSearchService } from './services/report-search.service';

const reports = [ArticleReport, CommentReport, PostReport, ReplyReport];
const makeReportAbilities = (action: Action): PolicyHandler[] => reports
  .map(subject => (ability: AppAbility): boolean => ability.can(action, subject));

@ApiTags('Reports')
@Controller({ path: 'reports' })
export class ReportsController {
  // eslint-disable-next-line max-params
  constructor(
    private readonly reportsService: ReportsService,
    private readonly postReportsService: PostReportsService,
    private readonly replyReportsService: ReplyReportsService,
    private readonly commentReportsService: CommentReportsService,
    private readonly articleReportsService: ArticleReportsService,
    private readonly reportSearchService: ReportSearchService,
  ) {}

  @Get()
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReports(@Query() query: PaginateDto): Promise<PaginatedResult<Report>> {
    if (query.page)
      return await this.reportsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.reportsService.findAll();
  }

  @UseGuards(TypesenseGuard)
  @Get('/search')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedReport> | SearchResponse<Report>> {
    if (full)
      return await this.reportSearchService.searchAndPopulate(query);
    return await this.reportSearchService.search(query);
  }

  @Get('by/:userId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findByUser(
    @Param('userId') userId: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<Report>> {
    if (query.page)
      return await this.reportsService.findByUser(userId, { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.reportsService.findByUser(userId);
  }

  @Get('posts')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllPostReports(@Query() query: PaginateDto): Promise<PaginatedResult<PostReport>> {
    if (query.page)
      return await this.postReportsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.postReportsService.findAll();
  }

  @Post('posts/:postId')
  @CheckPolicies(ability => ability.can(Action.Report, PostEntity))
  public async createPostReport(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<PostReport> {
    return await this.postReportsService.create(postId, user, createReportDto);
  }

  @Get('posts/:postId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReportsForPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<PostReport>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.postReportsService.findAllReportsForPost(postId, options);
    }
    return await this.postReportsService.findAllReportsForPost(postId);
  }

  @Get('replies')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReplyReports(@Query() query: PaginateDto): Promise<PaginatedResult<ReplyReport>> {
    if (query.page)
      return await this.replyReportsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.replyReportsService.findAll();
  }

  @Post('replies/:replyId')
  @CheckPolicies(ability => ability.can(Action.Report, Reply))
  public async createReplyReport(
    @Param('replyId') replyId: string,
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<ReplyReport> {
    return await this.replyReportsService.create(replyId, user, createReportDto);
  }

  @Get('replies/:replyId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReportsForReply(
    @Param('replyId') replyId: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<ReplyReport>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.replyReportsService.findAllReportsForReply(replyId, options);
    }
    return await this.replyReportsService.findAllReportsForReply(replyId);
  }

  @Get('comments')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllCommentReports(@Query() query: PaginateDto): Promise<PaginatedResult<CommentReport>> {
    if (query.page)
      return await this.commentReportsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.commentReportsService.findAll();
  }

  @Post('comments/:commentId')
  @CheckPolicies(ability => ability.can(Action.Report, Comment))
  public async createCommentReport(
    @Param('commentId') commentId: string,
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<CommentReport> {
    return await this.commentReportsService.create(commentId, user, createReportDto);
  }

  @Get('comments/:commentId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReportsForComment(
    @Param('commentId') commentId: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<CommentReport>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.commentReportsService.findAllReportsForComment(commentId, options);
    }
    return await this.commentReportsService.findAllReportsForComment(commentId);
  }

  @Get('articles')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllArticleReports(@Query() query: PaginateDto): Promise<PaginatedResult<ArticleReport>> {
    if (query.page)
      return await this.articleReportsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.articleReportsService.findAll();
  }

  @Post('articles/:articleId')
  @CheckPolicies(ability => ability.can(Action.Report, Article))
  public async createArticleReport(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ): Promise<ArticleReport> {
    return await this.articleReportsService.create(articleId, user, createReportDto);
  }

  @Get('articles/:articleId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findAllReportsForArticle(
    @Param('articleId', ParseIntPipe) articleId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<ArticleReport>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.articleReportsService.findAllReportsForArticle(articleId, options);
    }
    return await this.articleReportsService.findAllReportsForArticle(articleId);
  }

  @Get(':reportId')
  @CheckPolicies(...makeReportAbilities(Action.Read))
  public async findOneReport(@Param('reportId', ParseIntPipe) reportId: number): Promise<Report> {
    return await this.reportsService.findOneReport(reportId);
  }

  @Delete(':reportId')
  @CheckPolicies(...makeReportAbilities(Action.Delete))
  public async removeOneReport(@Param('reportId', ParseIntPipe) reportId: number): Promise<void> {
    await this.reportsService.removeOneReport(reportId);
  }
}
