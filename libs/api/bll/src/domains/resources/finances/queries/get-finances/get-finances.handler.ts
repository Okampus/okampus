import { GetFinancesQuery } from './get-finances.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { PaginatedFinanceModel } from '../../../../factories/domains/teams/finance.model';

@QueryHandler(GetFinancesQuery)
export class GetFinancesHandler implements IQueryHandler<GetFinancesQuery> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(query: GetFinancesQuery): Promise<PaginatedFinanceModel> {
    return await this.financeFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
