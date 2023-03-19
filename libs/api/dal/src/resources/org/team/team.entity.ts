import { TeamRepository } from './team.repository';
import { Org } from '../org.entity';
import { Form } from '../../ugc/form/form.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { ControlType, FormType, OrgKind, TeamRoleCategory, TeamType } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { TenantCore } from '../tenant/tenant-core.entity';

import type { TeamJoin } from '../../join/team-join/team-join.entity';
import type { Searchable } from '../../../types/search-entity.type';
import type { TeamOptions } from './team.options';
import type { TeamCategory } from '../../label/team-category/team-category.entity';
import type { VideoUpload } from '../../file-upload/video-upload/video-upload.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import type { Finance } from '../../manage-team/finance/finance.entity';

@Entity({ customRepository: () => TeamRepository })
export class Team extends Org implements Searchable {
  [EntityRepositoryType]!: TeamRepository;

  @Property({ type: 'text', nullable: true })
  tagline: string | null = null;

  @Enum({ items: () => TeamType, type: 'string', default: TeamType.Project })
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

  @OneToMany({ type: 'TeamJoin', mappedBy: 'team' })
  @TransformCollection()
  joins = new Collection<TeamJoin>(this);

  @OneToMany({ type: 'TeamRole', mappedBy: 'team' })
  @TransformCollection()
  roles = new Collection<TeamRole>(this);

  @OneToMany({ type: 'Finance', mappedBy: 'team' })
  @TransformCollection()
  finances = new Collection<Finance>(this);

  // Member count starts at one (1st user is owner)
  @Property({ type: 'int' })
  memberCount = 1;

  @ManyToOne({ type: 'Form' })
  joinForm!: Form;

  @Property({ type: 'text' })
  directorsCategoryName: string = TeamRoleCategory.Directors;

  @Property({ type: 'text' })
  managersCategoryName: string = TeamRoleCategory.Managers;

  @Property({ type: 'text' })
  membersCategoryName: string = TeamRoleCategory.Members;

  constructor(options: TeamOptions) {
    super({ ...options, orgKind: OrgKind.Team });
    this.assign({ ...options, orgKind: OrgKind.Team });

    if (this.joinForm) this.joinForm.representingOrgs.add(this);
  }
}

export const defaultTeamJoinForm = (name: string, tenant: TenantCore) =>
  new Form({
    isTemplate: false,
    name: `Formulaire d'adhésion de ${name}`,
    realAuthor: null,
    schema: [
      {
        fieldName: 'motivation',
        inputType: ControlType.Text,
        label: 'Motivation',
        required: true,
        placeholder: "Raison de l'adhésion",
      },
    ],
    description: `Formulaire d'adhésion officiel de ${name}`,
    type: FormType.TeamJoin,
    undeletable: true,
    tenant,
  });
