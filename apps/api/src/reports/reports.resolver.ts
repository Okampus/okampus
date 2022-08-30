
import { Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { Content } from '../contents/entities/content.entity';
import { APP_PUB_SUB } from '../shared/lib/constants';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SubscriptionType } from '../shared/lib/types/enums/subscription-type.enum';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(
    @Inject(APP_PUB_SUB) private readonly pubSub: PubSubEngine,
    private readonly reportsService: ReportsService,
  ) {}

  // TODO: Add permission checks
  @Query(() => [Report])
  public async reports(@CurrentUser() user: User): Promise<Report[]> {
    const paginatedReports = await this.reportsService.findAll(user);
    return paginatedReports.items;
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
