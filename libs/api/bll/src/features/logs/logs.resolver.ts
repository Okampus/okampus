// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from './logs.service';

import { Resolver, Args, Query } from '@nestjs/graphql';
import type { Log } from '@okampus/api/dal';

@Resolver('Log')
export class LogsResolver {
  constructor(private readonly logsService: LogsService) {}

  @Query()
  public async financeLogs(@Args('id') id: string): Promise<Log[]> {
    return await this.logsService.getFinanceLogs(id);
  }
}
