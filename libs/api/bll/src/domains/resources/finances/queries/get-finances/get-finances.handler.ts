import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import { PaginatedFinanceModel } from '../../../../factories/domains/teams/finance.model';
import { GetFinancesQuery } from './get-finances.query';

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