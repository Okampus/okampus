import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Org } from '../org.entity';
import { OrgKind } from '@okampus/shared/enums';
import { CanteenOptions } from './canteen.options';
import type { CanteenMember } from '../../membership/canteen-member/canteen-member.entity';
import { TransformCollection } from '@okampus/api/shards';

@Entity()
export class Canteen extends Org {
  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @OneToMany({ type: 'CanteenMember', mappedBy: 'canteen' })
  @TransformCollection()
  members = new Collection<CanteenMember>(this);

  // TODO: class delegates
  // TODO: referent admin

  constructor(options: CanteenOptions) {
    super({ ...options, orgKind: OrgKind.ClassGroup });
    this.assign({ ...options, orgKind: OrgKind.ClassGroup });
  }
}
