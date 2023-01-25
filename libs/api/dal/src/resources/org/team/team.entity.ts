import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Org } from '../org.entity';
import { OrgKind, TeamRoleCategory, TeamType } from '@okampus/shared/enums';
import { TeamOptions } from './team.options';
import { TransformCollection } from '@okampus/api/shards';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { TeamCategory } from '../../label/team-category/team-category.entity';
import { VideoUpload } from '../../file-upload/video-upload/video-upload.entity';
import { Form } from '../../ugc/form/form.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
// eslint-disable-next-line import/no-cycle
import { TeamRepository } from './team.repository';

@Entity({
  customRepository: () => TeamRepository,
})
export class Team extends Org {
  [EntityRepositoryType]!: TeamRepository;

  @Property({ type: 'text', nullable: true })
  tagline: string | null = null;

  @Enum(() => TeamType)
  type = TeamType.Team;

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

  @ManyToMany({ type: 'FileUpload', cascade: [Cascade.ALL] })
  @TransformCollection()
  files = new Collection<FileUpload>(this);

  @OneToMany({ type: 'TeamMember', mappedBy: 'team' })
  @TransformCollection()
  members = new Collection<TeamMember>(this);

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
