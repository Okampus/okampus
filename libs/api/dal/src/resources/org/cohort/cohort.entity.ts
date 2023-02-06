import { Org } from '../org.entity';
import { Collection, Entity, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { OrgKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { CohortOptions } from './cohort.options';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { CohortMember } from '../../membership/cohort-member/cohort-member.entity';

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
