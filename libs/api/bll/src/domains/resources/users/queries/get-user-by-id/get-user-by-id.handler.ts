import { GetUserByIdQuery } from './get-user-by-id.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { UserModel } from '../../../../factories/domains/users/user.model';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUserByIdQuery): Promise<UserModel> {
    return await this.userFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
