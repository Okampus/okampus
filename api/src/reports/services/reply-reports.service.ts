import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Reply } from '../../replies/entities/reply.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import type { CreateReportDto } from '../dto/create-report.dto';
import { ReplyReport } from '../entities/reply-report.entity';
import { ReportSearchService } from './report-search.service';

@Injectable()
export class ReplyReportsService {
  constructor(
    @InjectRepository(ReplyReport) private readonly replyReportRepository: BaseRepository<ReplyReport>,
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(replyId: string, user: User, createReportDto: CreateReportDto): Promise<ReplyReport> {
    const reply = await this.replyRepository.findOneOrFail({ replyId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Report, reply);

    const reports = await this.replyReportRepository.count({ reply, user });
    if (reports !== 0)
      throw new BadRequestException('User already reported this reply');

    const report = new ReplyReport({ reply, user, ...createReportDto });
    await this.replyReportRepository.persistAndFlush(report);
    await this.reportSearchService.add(report);
    return report;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<ReplyReport>> {
    return await this.replyReportRepository.findWithPagination(
      paginationOptions,
      { kind: 'reply' },
      { populate: ['reply', 'user'] },
    );
  }

  public async findAllReportsForReply(
    replyId: string,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<ReplyReport>> {
    return await this.replyReportRepository.findWithPagination(
      paginationOptions,
      { reply: { replyId } },
      { populate: ['reply', 'user'] },
    );
  }
}
