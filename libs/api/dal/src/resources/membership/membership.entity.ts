import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import type { User } from '../actor/user/user.entity';
import type { MembershipOptions } from './membership.options';
import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';

@Entity({
  discriminatorColumn: 'membershipKind',
  discriminatorMap: MembershipKind,
  abstract: true,
})
export class Membership extends TenantScopedEntity {
  @Enum(() => MembershipKind)
  membershipKind!: MembershipKind;

  @ManyToOne({ type: 'User' })
  user!: User;

  @Property({ type: 'datetime' })
  startDate: Date = new Date();

  @Property({ type: 'datetime', nullable: true })
  endDate: Date | null = null;

  constructor(options: MembershipOptions & { membershipKind: MembershipKind }) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
