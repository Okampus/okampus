import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { AdminReportCreatedNotification } from '../shared/modules/notifications/notifications';
import { NotificationsService } from '../shared/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '../shared/modules/pagination';
import type { User } from '../users/user.entity';
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
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(user: User, contentId: number, createReportDto: CreateReportDto): Promise<Content> {
    const content = await this.contentRepository.findOneOrFail(
      { id: contentId },
      { populate: ['lastEdit', 'author'] },
    );
    const target = content.author;

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

    content.reportCount++;
    await this.contentRepository.flush();

    void this.notificationsService.trigger(new AdminReportCreatedNotification(report));

    return content;
  }

  public async findAll(
    user: User,
    filters?: GetReportsDto,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<Report>> {
    let options: FilterQuery<Report> = {};
    if (filters?.byUserId)
      options = { ...options, user: { id: filters.byUserId } };
    if (filters?.forUserId)
      options = { ...options, target: { id: filters.forUserId } };
    if (filters?.throughContentId) {
      const canSeeHiddenContent = this.caslAbilityFactory.isModOrAdmin(user);
      const visibilityQuery = canSeeHiddenContent ? {} : { isVisible: true };
      options = { ...options, content: { id: filters.throughContentId, ...visibilityQuery } };
    }

    return await this.reportRepository.findWithPagination(
      paginationOptions,
      options,
      { populate: ['content', 'content.lastEdit', 'target'], orderBy: { createdAt: 'DESC' } },
    );
  }

  public async findOne(user: User, id: number): Promise<Report> {
    const report = await this.reportRepository.findOneOrFail({ id }, { populate: ['content', 'user', 'target'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, report.content);

    return report;
  }

  public async update(user: User, id: number, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.reportRepository.findOneOrFail(
      { id },
      { populate: ['content', 'user', 'target'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, report);

    wrap(report).assign(updateReportDto);
    await this.reportRepository.flush();
    await this.reportSearchService.update(report);
    return report;
  }

  public async remove(user: User, id: number): Promise<void> {
    const report = await this.reportRepository.findOneOrFail({ id }, { populate: ['content'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, report);

    await this.reportRepository.removeAndFlush(report);
    await this.reportSearchService.remove(report.id.toString());

    report.content.reportCount--;
    await this.contentRepository.flush();
  }
}
