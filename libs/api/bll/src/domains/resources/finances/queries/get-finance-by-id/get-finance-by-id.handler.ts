import { GetFinanceByIdQuery } from './get-finance-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';

@QueryHandler(GetFinanceByIdQuery)
export class GetFinanceByIdHandler implements IQueryHandler<GetFinanceByIdQuery> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(query: GetFinanceByIdQuery): Promise<FinanceModel> {
    return this.financeFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
