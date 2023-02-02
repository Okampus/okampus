import { AggregateRoot } from '@nestjs/cqrs';
import { Field, ObjectType } from '@nestjs/graphql';
import { ITenant, IUser } from '@okampus/shared/dtos';
import { TenantModel } from '../../../domains/factories/domains/tenants/tenant.model';
import { UserModel } from '../../../domains/factories/domains/users/user.model';

const userField = 'user';
const tenantField = 'tenant';

@ObjectType()
export class AuthContextModel extends AggregateRoot {
  @Field(() => UserModel)
  [userField]!: IUser;

  @Field(() => TenantModel)
  [tenantField]!: ITenant;

  constructor(user: IUser, tenant: ITenant) {
    super();
    this[userField] = user;
    this[tenantField] = tenant;
  }
}

export function getAuthContextPopulate(populate: string[]): { user: never[]; tenant: never[] } {
  const userPopulate = (populate
    ?.filter((str: string) => str.startsWith(`${userField}.`))
    ?.map((str: string) => str.replace(`${userField}.`, '')) ?? ['shortcuts']) as never[];

  const tenantPopulate = (populate
    ?.filter((str: string) => str.startsWith(`${tenantField}.`))
    ?.map((str: string) => str.replace(`${tenantField}.`, '')) ?? ['actor']) as never[];

  return { user: userPopulate, tenant: tenantPopulate };
}
