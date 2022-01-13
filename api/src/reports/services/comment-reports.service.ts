import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Comment } from '../../comments/entities/comment.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import type { CreateReportDto } from '../dto/create-report.dto';
import { CommentReport } from '../entities/comment-report.entity';
import { ReportSearchService } from './report-search.service';

@Injectable()
export class CommentReportsService {
  constructor(
    @InjectRepository(CommentReport) private readonly commentReportRepository: BaseRepository<CommentReport>,
    @InjectRepository(Comment) private readonly commentRepository: BaseRepository<Comment>,
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(commentId: string, user: User, createReportDto: CreateReportDto): Promise<CommentReport> {
    const comment = await this.commentRepository.findOneOrFail({ commentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Report, comment);

    const reports = await this.commentReportRepository.count({ comment, user });
    if (reports !== 0)
      throw new BadRequestException('User already reported this comment');

    const report = new CommentReport({ comment, user, ...createReportDto });
    await this.commentReportRepository.persistAndFlush(report);
    await this.reportSearchService.add(report);
    return report;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<CommentReport>> {
    return await this.commentReportRepository.findWithPagination(
      paginationOptions,
      { kind: 'comment' },
      { populate: ['comment', 'user'] },
    );
  }

  public async findAllReportsForComment(
    commentId: string,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<CommentReport>> {
    return await this.commentReportRepository.findWithPagination(
      paginationOptions,
      { comment: { commentId } },
      { populate: ['comment', 'user'] },
    );
  }
}
