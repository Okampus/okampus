import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { IMembership, ITenantCore, IUser } from '@okampus/shared/dtos';
import { MembershipKind } from '@okampus/shared/enums';
import { Paginated } from '../../../shards/types/paginated.type';
import { UserModel } from '../users/user.model';
import { TenantScopedModel } from './tenant-scoped.model';

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
