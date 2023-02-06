import { GetUserBySlugQuery } from './get-user-by-slug.query';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler } from '@nestjs/cqrs';
import type { UserModel } from '../../../../factories/domains/users/user.model';

@QueryHandler(GetUserBySlugQuery)
export class GetUserBySlugHandler implements IQueryHandler<GetUserBySlugQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUserBySlugQuery): Promise<UserModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return await this.userFactory.findOneOrFail(where, { populate: query.populate });
  }
}
