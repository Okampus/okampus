import { Entity, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import { Membership } from '../membership.entity';
import { Canteen } from '../../org/canteen/canteen.entity';
import { CanteenRole } from '../../role/canteen-role/canteen-role.entity';
import { CanteenMemberOptions } from './canteen-member.options';

@Entity()
export class CanteenMember extends Membership {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  @ManyToMany({ type: 'CanteenRole' })
  canteenRole!: CanteenRole;

  constructor(options: CanteenMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.CanteenMember });
    this.assign({ ...options, membershipKind: MembershipKind.CanteenMember });
  }
}
