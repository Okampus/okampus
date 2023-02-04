import { TeamRepository } from './team.repository';
import { Org } from '../org.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { OrgKind, TeamRoleCategory, TeamType } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { TeamOptions } from './team.options';
import type { TeamCategory } from '../../label/team-category/team-category.entity';
import type { VideoUpload } from '../../file-upload/video-upload/video-upload.entity';
import type { Form } from '../../ugc/form/form.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';

import type { TeamRole } from '../../role/team-role/team-role.entity';

import type { Finance } from '../../manage-team/finance/finance.entity';

@Entity({
  customRepository: () => TeamRepository,
})
export class Team extends Org {
  [EntityRepositoryType]!: TeamRepository;

  @Property({ type: 'text', nullable: true })
  tagline: string | null = null;

  @Enum(() => TeamType)
  type = TeamType.Project;

  @ManyToMany({ type: 'TeamCategory' })
  @TransformCollection()
  categories = new Collection<TeamCategory>(this);

  // @OneToMany('TeamHistory', 'team')
  // histories = new Collection<TeamHistory>(this);

  @OneToOne({ type: 'VideoUpload', nullable: true })
  video: VideoUpload | null = null;

  // TODO: long-term, convert to currency + amount + manage payments
  @Property({ type: 'int' })
  membershipFees = 0;

  @Property({ type: 'int' })
  currentFinance = 0;

  @OneToMany({ type: 'TeamMember', mappedBy: 'team' })
  @TransformCollection()
  members = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TeamRole', mappedBy: 'team' })
  @TransformCollection()
  roles = new Collection<TeamRole>(this);

  @OneToMany({ type: 'Finance', mappedBy: 'team' })
  @TransformCollection()
  finances = new Collection<Finance>(this);

  // Member count starts at one (1st user is owner)
  @Property({ type: 'int' })
  memberCount = 1;

  @OneToOne({ type: 'Form', nullable: true })
  joinForm: Form | null = null;

  @Property({ type: 'text' })
  directorsCategoryName: string = TeamRoleCategory.Directors;

  @Property({ type: 'text' })
  managersCategoryName: string = TeamRoleCategory.Managers;

  @Property({ type: 'text' })
  membersCategoryName: string = TeamRoleCategory.Members;

  constructor(options: TeamOptions) {
    super({ ...options, orgKind: OrgKind.Team });
    this.assign({ ...options, orgKind: OrgKind.Team });
  }
}
