import { LogsService } from './logs.service';

import { Resolver, Args, Query } from '@nestjs/graphql';
import type { Log } from '@okampus/api/dal';

@Resolver('Log')
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query()
  public async eventLogs(@Args('id') id: string): Promise<Log[]> {
    return await this.logsService.getEventLogs(id);
  }

  @Query()
  public async transactionLogs(@Args('id') id: string): Promise<Log[]> {
    return await this.logsService.getTransactionLogs(id);
  }

  @Query()
  public async teamLogs(@Args('id') id: string): Promise<Log[]> {
    return await this.logsService.getTeamLogs(id);
  }

  @Query()
  public async tenantLogs(@Args('id') id: string): Promise<Log[]> {
    return await this.logsService.getTenantLogs(id);
  }
}
