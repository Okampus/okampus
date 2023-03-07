import { GetUsersQuery } from './get-users.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';
import { userFilterQuery } from '../../../filter-query.utils';
import { QueryHandler } from '@nestjs/cqrs';

import type { IQueryHandler } from '@nestjs/cqrs';
import type { PaginatedUserModel } from '../../../../factories/domains/users/user.model';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUsersQuery): Promise<PaginatedUserModel> {
    return await this.userFactory.findWithPagination(
      query.paginationOptions,
      userFilterQuery(query.filterQuery, query.tenant.id),
      { populate: query.populate }
    );
  }
}
