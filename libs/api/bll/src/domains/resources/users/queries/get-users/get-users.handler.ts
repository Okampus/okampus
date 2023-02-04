import { GetUsersQuery } from './get-users.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { UserFactory } from '../../../../factories/domains/users/user.factory';
import type { PaginatedUserModel } from '../../../../factories/domains/users/user.model';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUsersQuery): Promise<PaginatedUserModel> {
    return await this.userFactory.findWithPagination(
      query.paginationOptions,
      { tenant: { id: query.tenant.id } },
      { populate: query.populate }
    );
  }
}
