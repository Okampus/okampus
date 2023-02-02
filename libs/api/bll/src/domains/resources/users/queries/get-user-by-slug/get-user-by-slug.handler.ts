import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../../../factories/domains/users/user.factory';
import { UserModel } from '../../../../factories/domains/users/user.model';
import { GetUserBySlugQuery } from './get-user-by-slug.query';

@QueryHandler(GetUserBySlugQuery)
export class GetUserBySlugHandler implements IQueryHandler<GetUserBySlugQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUserBySlugQuery): Promise<UserModel> {
    const where = { actor: { slug: query.slug }, tenant: { id: query.tenant.id } };
    return await this.userFactory.findOneOrFail(where, { populate: query.populate });
  }
}
