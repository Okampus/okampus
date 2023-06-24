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
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import type { Account } from './account/account.entity';
import type { TeamHistory } from './team-history/team-history.entity';
import type { TenantManage } from '../tenant/tenant-manage/tenant-manage.entity';
import type { TeamOptions } from './team.options';
import type { Action } from './action/action.entity';
import type { ClassGroup } from '../class-group/class-group.entity';
import type { Cohort } from '../cohort/cohort.entity';
import type { Canteen } from '../canteen/canteen.entity';
import type { Document } from '../document/document.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Pole } from './pole/pole.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Finance } from './finance/finance.entity';
import type { TeamJoin } from './team-join/team-join.entity';
import type { TeamMember } from './team-member/team-member.entity';
import type { Role } from './role/role.entity';
import type { LegalUnit } from '../actor/legal-unit/legal-unit.entity';
import type { EventManage } from '../event/event-manage/event-manage.entity';
import type { AccountAllocate } from './account-allocate/account-allocate.entity';

@Entity({ customRepository: () => TeamRepository })
export class Team extends TenantScopedEntity implements Searchable {
  [EntityRepositoryType]!: TeamRepository;

  @Enum({ items: () => TeamType, type: EnumType, default: TeamType.Club })
  type = TeamType.Club;

  // TODO: long-term, convert to currency + amount + manage payments
  @Property({ type: 'float', default: 0 })
  membershipFees = 0;

  // ISO 8601 duration format (PnYnMnDTnHnMnS) / '' if forever
  @Property({ type: 'text', default: '' })
  membershipDuration = '';

  @Property({ type: 'float', default: 0 })
  currentFinance = 0;

  @Property({ type: 'text', default: RoleCategory.Directors })
  directorsCategoryName: string = RoleCategory.Directors;

  @Property({ type: 'text', default: RoleCategory.Managers })
  managersCategoryName: string = RoleCategory.Managers;

  @Property({ type: 'text', default: RoleCategory.Members })
  membersCategoryName: string = RoleCategory.Members;

  @Property({ type: 'boolean', default: true })
  isJoinFormActive = true;

  @OneToOne({ type: 'Form', mappedBy: 'team' })
  joinForm: Form;

  @OneToOne({ type: 'Actor', mappedBy: 'team' })
  actor!: Actor;

  @OneToOne({ type: 'Canteen', inversedBy: 'team', nullable: true, default: null })
  canteen: Canteen | null = null;

  @OneToOne({ type: 'Cohort', inversedBy: 'team', nullable: true, default: null })
  cohort: Cohort | null = null;

  @OneToOne({ type: 'ClassGroup', inversedBy: 'team', nullable: true, default: null })
  classGroup: ClassGroup | null = null;

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  tenantGrantFund: LegalUnit | null = null;

  @ManyToOne({ type: 'Team', nullable: true, default: null, cascade: [Cascade.ALL] })
  parent: Team | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  video: FileUpload | null = null;

  @OneToMany({ type: 'Team', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Team>(this);

  @OneToMany({ type: 'Document', mappedBy: 'team', cascade: [Cascade.ALL] })
  @TransformCollection()
  documents = new Collection<Document>(this);

  @OneToMany({ type: 'Action', mappedBy: 'team' })
  @TransformCollection()
  actions = new Collection<Action>(this);

  @OneToMany({ type: 'Account', mappedBy: 'team' })
  @TransformCollection()
  accounts = new Collection<Account>(this);

  @OneToMany({ type: 'AccountAllocate', mappedBy: 'team' })
  @TransformCollection()
  accountAllocates = new Collection<AccountAllocate>(this);

  @OneToMany({ type: 'EventManage', mappedBy: 'team' })
  @TransformCollection()
  eventManages = new Collection<EventManage>(this);

  @OneToMany({ type: 'TeamHistory', mappedBy: 'team' })
  @TransformCollection()
  history = new Collection<TeamHistory>(this);

  @OneToMany({ type: 'Finance', mappedBy: 'team' })
  @TransformCollection()
  finances = new Collection<Finance>(this);

  @OneToMany({ type: 'TeamJoin', mappedBy: 'team' })
  @TransformCollection()
  teamJoins = new Collection<TeamJoin>(this);

  @OneToMany({ type: 'TeamMember', mappedBy: 'team' })
  @TransformCollection()
  teamMembers = new Collection<TeamMember>(this);

  @OneToMany({ type: 'TenantManage', mappedBy: 'team' })
  @TransformCollection()
  tenantManages = new Collection<TenantManage>(this);

  @OneToMany({ type: 'Role', mappedBy: 'team' })
  @TransformCollection()
  roles = new Collection<Role>(this);

  @OneToMany({ type: 'Pole', mappedBy: 'team' })
  @TransformCollection()
  poles = new Collection<Pole>(this);

  constructor(options: TeamOptions) {
    super(options);
    this.assign(options);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
      slug: options.slug,
      status: options.status,
      tags: options.tags,
      createdBy: options.createdBy,
      tenant: options.tenant,
      team: this,
    });

    this.joinForm = new Form({
      name: `Formulaire d'adhésion de ${options.name}`,
      schema: [
        {
          name: 'motivation',
          type: ControlType.Text,
          label: "Quelle est votre motivation pour rejoindre l'équipe ?",
          isRequired: true,
        },
      ],
      team: this,
      type: FormType.Team,
      allowEditingAnswers: true,
      allowMultipleAnswers: false,
      undeletable: true,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });
  }
}
