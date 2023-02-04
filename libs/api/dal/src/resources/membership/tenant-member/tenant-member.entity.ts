import { Entity } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import { Membership } from '../membership.entity';
import type { TenantMemberOptions } from './tenant-member.options';

@Entity()
export class TenantMember extends Membership {
  // @ManyToOne({ type: 'Tenant' })
  // tenant!: Tenant;

  // @ManyToOne({ type: 'TenantRole' })
  // role!: TenantRole;

  // @OneToMany({ type: 'TeamAction', mappedBy: 'teamMember' })
  // @TransformCollection()
  // activities = new Collection<TeamAction>(this);

  constructor(options: TenantMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.TeamMember });
    this.assign({ ...options, membershipKind: MembershipKind.TeamMember });
  }
}
