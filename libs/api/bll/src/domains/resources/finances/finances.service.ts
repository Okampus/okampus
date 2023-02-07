import { CreateFinanceCommand } from './commands/create-finance/create-finance.command';
import { DeleteFinanceCommand } from './commands/delete-finance/delete-finance.command';
import { UpdateFinanceCommand } from './commands/update-finance/update-finance.command';
import { GetFinanceByIdQuery } from './queries/get-finance-by-id/get-finance-by-id.query';
import { GetFinancesByTeamQuery } from './queries/get-finances-by-team/get-finances-by-team.query';
import { GetFinancesQuery } from './queries/get-finances/get-finances.query';
import { RequestContext } from '../../../shards/abstract/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { CreateFinanceDto, UpdateProjectDto } from '@okampus/shared/dtos';
import type { MulterFileType, Snowflake } from '@okampus/shared/types';
import type { PaginationOptions } from '../../../shards/types/pagination-options.type';
import type { FinanceModel, PaginatedFinanceModel } from '../../factories/domains/teams/finance.model';

const defaultFinancePopulate = ['actor', 'actor.images', 'actor.socials', 'actor.tags'];

@Injectable()
export class FinancesService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  findOneById(id: Snowflake): Promise<FinanceModel> {
    const query = new GetFinanceByIdQuery(id, this.tenant(), this.autoGqlPopulate(defaultFinancePopulate));
    return this.queryBus.execute(query);
  }

  find(paginationOptions: PaginationOptions): Promise<PaginatedFinanceModel> {
    const query = new GetFinancesQuery(paginationOptions, this.tenant(), this.autoGqlPopulate(defaultFinancePopulate));
    return this.queryBus.execute(query);
  }

  findByTeam(teamId: string, paginationOptions: PaginationOptions): Promise<PaginatedFinanceModel> {
    const query = new GetFinancesByTeamQuery(
      teamId,
      paginationOptions,
      this.tenant(),
      this.autoGqlPopulate(defaultFinancePopulate)
    );
    return this.queryBus.execute(query);
  }

  create(createFinance: CreateFinanceDto, receipts?: MulterFileType[]): Promise<FinanceModel> {
    const command = new CreateFinanceCommand(createFinance, this.requester(), this.tenant(), receipts);
    return this.commandBus.execute(command);
  }

  update(updateFinance: UpdateProjectDto): Promise<FinanceModel> {
    const command = new UpdateFinanceCommand(
      updateFinance,
      this.tenant(),
      this.autoGqlPopulate(defaultFinancePopulate)
    );
    return this.commandBus.execute(command);
  }

  delete(id: Snowflake) {
    const command = new DeleteFinanceCommand(id, this.tenant());
    return this.commandBus.execute(command);
  }
}
