import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Content } from '@create/contents/entities/content.entity';
import { CreateReportDto } from '@interact/reports/dto/create-report.dto';
import { APP_PUB_SUB } from '@lib/constants';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { SubscriptionType } from '@lib/types/enums/subscription-type.enum';
import { User } from '@uaa/users/user.entity';
import { PaginatedReport, Report } from './report.entity';
import { ReportsService } from './reports.service';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly reportsService: ReportsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => PaginatedReport)
  public async reports(@CurrentUser() user: User): Promise<PaginatedReport> {
    return await this.reportsService.findAll(user);
  }

  @Query(() => Report)
  public async reportById(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Report> {
    return await this.reportsService.findOne(user, id);
  }

  // TODO: for future favorite caching in frontend, return both content and favorite in an array
  @Mutation(() => Content)
  public async createReport(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('report') report: CreateReportDto,
  ): Promise<Content> {
    const updatedContent = await this.reportsService.create(user, id, report);
    await this.pubSub.publish(SubscriptionType.ReportAdded, { reportAdded: updatedContent });
    return updatedContent;
  }
}
