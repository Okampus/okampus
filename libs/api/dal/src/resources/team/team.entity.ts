import { TeamRepository } from './team.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Actor } from '../actor/actor.entity';
import { Form } from '../form/form.entity';
import { TransformCollection } from '@okampus/api/shards';
import { RoleCategory, ControlType, FormType, TeamType } from '@okampus/shared/enums';

import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import type { ClassGroup } from '../class-group/class-group.entity';
import type { Cohort } from '../cohort/cohort.entity';
import type { Canteen } from '../canteen/canteen.entity';
import type { Pole } from './pole/pole.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Document } from '../document/document.entity';
import type { Event } from '../event/event.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Action } from './action/action.entity';
import type { TeamFinance } from './team-finance/team-finance.entity';
import type { TeamJoin } from './team-join/team-join.entity';
import type { TeamMember } from './team-member/team-member.entity';
import type { Role } from './role/role.entity';
import type { TeamOptions } from './team.options';
import type { Upload } from '../upload/upload';

@Entity({ customRepository: () => TeamRepository })
export class Team extends TenantScopedEntity implements Searchable {
  [EntityRepositoryType]!: TeamRepository;

  @OneToOne({ type: 'Actor', mappedBy: 'team' })
  actor!: Actor;

  @OneToOne({ type: 'Canteen', inversedBy: 'team', nullable: true, default: null })
  canteen: Canteen | null = null;

  @OneToOne({ type: 'Cohort', inversedBy: 'team', nullable: true, default: null })
  cohort: Cohort | null = null;

  @OneToOne({ type: 'ClassGroup', inversedBy: 'team', nullable: true, default: null })
  classGroup: ClassGroup | null = null;

  @OneToOne({ type: 'Form', inversedBy: 'team', nullable: true, default: null })
  joinForm: Form | null = null;

  @ManyToMany({ type: 'Event', inversedBy: 'teams' })
  @TransformCollection()
  events = new Collection<Event>(this);

  @ManyToOne({ type: 'Team', nullable: true, default: null, cascade: [Cascade.ALL] })
  parent: Team | null = null;

  @OneToMany({ type: 'Team', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Team>(this);

  @OneToMany({ type: 'Document', mappedBy: 'team', cascade: [Cascade.ALL] })
  @TransformCollection()
  documents = new Collection<Document>(this);

  @Property({ type: 'text', nullable: true, default: null })
  tagline: string | null = null;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  categories = new Collection<Tag>(this);

  @Enum({ items: () => TeamType, type: EnumType, default: TeamType.Club })
  type = TeamType.Club;

  // @OneToMany('TeamHistory', 'team')
  // histories = new Collection<TeamHistory>(this);

  @ManyToOne({ type: 'Upload', nullable: true, default: null })
  video: Upload | null = null;

  // TODO: long-term, convert to currency + amount + manage payments
  @Property({ type: 'int' })
  membershipFees = 0;

  @Property({ type: 'int' })
  currentFinance = 0;

  @OneToMany({ type: 'Action', mappedBy: 'team' })
  @TransformCollection()
  actions = new Collection<Action>(this);

  @OneToMany({ type: 'TeamFinance', mappedBy: 'team' })
  @TransformCollection()
  teamFinances = new Collection<TeamFinance>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'team' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  @OneToMany({ type: 'TeamMember', mappedBy: 'team' })
  @TransformCollection()
  teamMembers = new Collection<TeamMember>(this);

  @OneToMany({ type: 'Role', mappedBy: 'team' })
  @TransformCollection()
  roles = new Collection<Role>(this);

  @OneToMany({ type: 'Pole', mappedBy: 'team' })
  @TransformCollection()
  poles = new Collection<Pole>(this);

  @Property({ type: 'text' })
  directorsCategoryName: string = RoleCategory.Directors;

  @Property({ type: 'text' })
  managersCategoryName: string = RoleCategory.Managers;

  @Property({ type: 'text' })
  membersCategoryName: string = RoleCategory.Members;

  constructor(options: TeamOptions) {
    super(options);
    this.assign(options);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      primaryEmail: options.primaryEmail,
      slug: options.slug,
      tags: options.tags,
      createdBy: options.createdBy,
      tenant: options.tenant,
      team: this,
    });

    this.joinForm = new Form({
      name: `Formulaire d'adhésion de ${options.name}`,
      schema: [
        {
          slug: 'motivation',
          type: ControlType.Text,
          label: "Quelle est ta motivation pour rejoindre l'équipe ?",
          isRequired: true,
        },
      ],
      team: this,
      type: FormType.TeamJoin,
      allowEditingAnswers: true,
      allowMultipleAnswers: false,
      undeletable: true,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });
  }
}
