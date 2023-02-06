import { Membership } from '../membership.entity';
import { Entity, ManyToOne } from '@mikro-orm/core';
import { MembershipKind } from '@okampus/shared/enums';
import type { Cohort } from '../../org/cohort/cohort.entity';
import type { CohortMemberOptions } from './cohort-member.options';

@Entity()
export class CohortMember extends Membership {
  @ManyToOne({ type: 'Cohort' })
  cohort!: Cohort;

  constructor(options: CohortMemberOptions) {
    super({ ...options, membershipKind: MembershipKind.CohortMember });
    this.assign({ ...options, membershipKind: MembershipKind.CohortMember });
  }
}
