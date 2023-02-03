import { Entity, ManyToOne } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import { Membership } from '../membership.entity';
import { ClassGroup } from '../../org/class-group/class-group.entity';
import { ClassGroupMemberOptions } from './class-group-member.options';

@Entity()
export class ClassGroupMember extends Membership {
  @ManyToOne({ type: 'ClassGroup' })
  classGroup!: ClassGroup;

  // @ManyToOne({ type: 'ClassGroupRole' })
  // role!: ClassGroupRole;

  constructor(options: ClassGroupMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.ClassGroupMember });
    this.assign({ ...options, membershipKind: MembershipKind.ClassGroupMember });
  }
}
