import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { Report } from './entities/report.entity';
import { ReportSearchService } from './services/report-search.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    private readonly reportSearchService: ReportSearchService,
  ) {}

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Report>> {
    return await this.reportRepository.findWithPagination(
      paginationOptions,
      {},
      { populate: ['article', 'post', 'reply', 'comment', 'user'] },
    );
  }

  public async findByUser(userId: string, paginationOptions?: PaginationOptions): Promise<PaginatedResult<Report>> {
    return await this.reportRepository.findWithPagination(
      paginationOptions,
      { user: { userId } },
      { populate: ['article', 'post', 'reply', 'comment', 'user'] },
    );
  }

  public async findOneReport(reportId: number): Promise<Report> {
    return await this.reportRepository.findOneOrFail({ reportId });
  }

  public async removeOneReport(reportId: number): Promise<void> {
    const report = await this.reportRepository.findOneOrFail({ reportId });
    await this.reportRepository.removeAndFlush(report);
    await this.reportSearchService.remove(report.reportId.toString());
  }
}
