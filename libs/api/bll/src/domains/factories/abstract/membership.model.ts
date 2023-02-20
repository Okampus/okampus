import { TenantScopedModel } from './tenant-scoped.model';
import { Paginated } from '../../../shards/types/paginated.type';
// eslint-disable-next-line import/no-cycle
import { UserModel } from '../domains/users/user.model';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { MembershipKind } from '@okampus/shared/enums';
import type { IMembership, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class MembershipModel extends TenantScopedModel implements IMembership {
  @Field(() => MembershipKind)
  membershipKind!: MembershipKind;

  @Field(() => UserModel, { nullable: true })
  user?: IUser;

  @Field(() => GraphQLISODateTime)
  startDate!: Date;

  @Field(() => Date, { nullable: true })
  endDate!: Date | null;

  constructor(membership: IMembership) {
    if (!membership.tenant) throw new Error('Membership must have a tenant');
    super(membership.tenant);
    this.assign(membership);
  }
}

@ObjectType()
export class PaginatedMembershipModel extends Paginated(MembershipModel) {}
