import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../../../factories/users/user.factory';
import { UserModel } from '../../../../factories/users/user.model';
import { GetUserByIdQuery } from './get-user-by-id.query';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUserByIdQuery): Promise<UserModel> {
    return await this.userFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
