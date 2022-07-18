import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import { User } from '../users/user.entity';
import type { CreateReportDto } from './dto/create-report.dto';
import type { GetReportsDto } from './dto/get-reports.dto';
import type { UpdateReportDto } from './dto/update-report.dto';
import { ReportSearchService } from './report-search.service';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(targetUserId: string, user: User, createReportDto: CreateReportDto): Promise<Report> {
    const target = await this.userRepository.findOneOrFail({ userId: targetUserId });
    const content = await this.contentRepository.findOneOrFail({ contentId: createReportDto.contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Report, content);

    const reports = await this.reportRepository.count({ content, user, target });
    if (reports !== 0)
      throw new BadRequestException('User already reported through this content or no content linked to this user.');

    const report = new Report({
      ...createReportDto,
      content,
      target,
      user,
    });

    await this.reportRepository.persistAndFlush(report);
    await this.reportSearchService.add(report);

    if (content) {
      content.nReports++;
      await this.contentRepository.flush();
    }

    return report;
  }

  public async findAll(
    user: User,
    filters: GetReportsDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Report>> {
    let options: FilterQuery<Report> = {};
    if (filters.byUserId)
      options = { ...options, user: { userId: filters.byUserId } };
    if (filters.forUserId)
      options = { ...options, target: { userId: filters.forUserId } };
    if (filters.throughContentId) {
      const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
      const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
      options = { ...options, content: { contentId: filters.throughContentId, ...visibilityQuery } };
    }

    return await this.reportRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['content', 'target'], orderBy: { createdAt: 'DESC' } },
    );
  }

  public async findOne(user: User, reportId: number): Promise<Report> {
    const report = await this.reportRepository.findOneOrFail({ reportId }, { populate: ['content', 'user', 'target'] });

    if (report.content) {
      const ability = this.caslAbilityFactory.createForUser(user);
      assertPermissions(ability, Action.Read, report.content);
    }

    return report;
  }

  public async update(user: User, reportId: number, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.reportRepository.findOneOrFail(
      { reportId },
      { populate: ['content', 'user', 'target'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, report);

    wrap(report).assign(updateReportDto);
    await this.reportRepository.flush();
    await this.reportSearchService.update(report);
    return report;
  }

  public async remove(user: User, reportId: number): Promise<void> {
    const report = await this.reportRepository.findOneOrFail({ reportId }, { populate: ['content'] });

    if (report.content) {
      const ability = this.caslAbilityFactory.createForUser(user);
      assertPermissions(ability, Action.Delete, report);
    }

    await this.reportRepository.removeAndFlush(report);
    await this.reportSearchService.remove(report.reportId.toString());

    if (report.content) {
      report.content.nReports--;
      await this.contentRepository.flush();
    }
  }
}
