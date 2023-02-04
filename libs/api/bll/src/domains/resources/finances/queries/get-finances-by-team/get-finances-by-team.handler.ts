import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { PaginatedFinanceModel } from '../../../../factories/domains/teams/finance.model';
import { GetFinancesByTeamQuery } from './get-finances-by-team.query';

@QueryHandler(GetFinancesByTeamQuery)
export class GetFinancesByTeamHandler implements IQueryHandler<GetFinancesByTeamQuery> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(query: GetFinancesByTeamQuery): Promise<PaginatedFinanceModel> {
    // TODO: throw error if team does not exist
    return await this.financeFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id }, team: { id: query.teamId } },
      { populate: query.populate }
    );
  }
}
