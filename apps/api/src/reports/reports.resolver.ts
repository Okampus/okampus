
import {
 Args,
 Int,
 Query,
 Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Report } from './report.entity';
import { ReportsService } from './reports.service';

@Resolver(() => Report)
export class ReportsResolver {
  constructor(
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
}
