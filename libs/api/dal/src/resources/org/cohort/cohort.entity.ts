import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { Org } from '../org.entity';
import { OrgKind } from '@okampus/shared/enums';
import type { CohortOptions } from './cohort.options';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { CohortMember } from '../../membership/cohort-member/cohort-member.entity';
import { TransformCollection } from '@okampus/api/shards';

@Entity()
export class Cohort extends Org {
  @Property({ type: 'smallint' })
  year!: number;

  @OneToMany({ type: 'CohortMember', mappedBy: 'cohort' })
  @TransformCollection()
  members = new Collection<CohortMember>(this);

  @OneToOne({ type: 'ImageUpload', nullable: true })
  logo: ImageUpload | null = null;

  constructor(options: CohortOptions) {
    super({ ...options, orgKind: OrgKind.Cohort });
    this.assign({ ...options, orgKind: OrgKind.Cohort });
  }
}
