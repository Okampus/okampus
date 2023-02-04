import { TenantScopedModel } from './tenant-scoped.model';
import { Paginated } from '../../../shards/types/paginated.type';
import { UserModel } from '../domains/users/user.model';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { MembershipKind } from '@okampus/shared/enums';
import type { IMembership, ITenantCore, IUser } from '@okampus/shared/dtos';

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
    super(membership.tenant as ITenantCore);
    this.assign(membership);
  }
}

@ObjectType()
export class PaginatedMembershipModel extends Paginated(MembershipModel) {}
