import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../../../factories/users/user.factory';
import { PaginatedUserModel } from '../../../../factories/users/user.model';
import { GetUsersQuery } from './get-users.query';

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
