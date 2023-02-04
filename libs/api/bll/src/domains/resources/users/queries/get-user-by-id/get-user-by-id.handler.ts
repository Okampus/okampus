import { GetUserByIdQuery } from './get-user-by-id.query';
import { QueryHandler } from '@nestjs/cqrs';
import type { IQueryHandler} from '@nestjs/cqrs';
import type { UserFactory } from '../../../../factories/domains/users/user.factory';
import type { UserModel } from '../../../../factories/domains/users/user.model';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(query: GetUserByIdQuery): Promise<UserModel> {
    return await this.userFactory.findOneOrFail({ id: query.id }, { populate: query.populate });
  }
}
