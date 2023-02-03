import { Collection, Entity, ManyToMany, ManyToOne } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import { Membership } from '../membership.entity';
import { Canteen } from '../../org/canteen/canteen.entity';
import { CanteenRole } from '../../role/canteen-role/canteen-role.entity';
import { CanteenMemberOptions } from './canteen-member.options';
import { TransformCollection } from '@okampus/api/shards';

@Entity()
export class CanteenMember extends Membership {
  @ManyToOne({ type: 'Canteen' })
  canteen!: Canteen;

  @ManyToMany({ type: 'CanteenRole' })
  @TransformCollection()
  canteenRoles = new Collection<CanteenRole>(this);

  constructor(options: CanteenMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.CanteenMember });
    this.assign({ ...options, membershipKind: MembershipKind.CanteenMember });
  }
}
