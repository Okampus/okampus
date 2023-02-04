import type { IQueryHandler} from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import type { FinanceFactory } from '../../../../factories/domains/teams/finance.factory';
import type { FinanceModel } from '../../../../factories/domains/teams/finance.model';
import { GetFinanceByIdQuery } from './get-finance-by-id.query';

@QueryHandler(GetFinanceByIdQuery)
export class GetFinanceByIdHandler implements IQueryHandler<GetFinanceByIdQuery> {
  constructor(private readonly financeFactory: FinanceFactory) {}

  async execute(query: GetFinanceByIdQuery): Promise<FinanceModel> {
    return this.financeFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
