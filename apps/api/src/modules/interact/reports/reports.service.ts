import type { FilterQuery } from '@mikro-orm/core';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { assertPermissions } from '@common/lib/utils/assert-permission';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { AdminReportCreatedNotification } from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { Content } from '@modules/create/contents/entities/content.entity';
import type { CreateReportDto } from '@modules/interact/reports/dto/create-report.dto';
import type { User } from '@modules/uua/users/user.entity';
import type { GetReportsDto } from './dto/get-reports.dto';
import type { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
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
      { populate: ['content', 'content.lastEdit', 'target', 'user'], orderBy: { createdAt: 'DESC' } },
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
    return report;
  }

  public async remove(user: User, id: number): Promise<void> {
    const report = await this.reportRepository.findOneOrFail({ id }, { populate: ['content'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Delete, report);

    await this.reportRepository.removeAndFlush(report);

    report.content.reportCount--;
    await this.contentRepository.flush();
  }
}
