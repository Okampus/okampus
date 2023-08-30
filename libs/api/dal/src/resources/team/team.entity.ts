import { TeamRepository } from './team.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Actor } from '../actor/actor.entity';
import { Form } from '../form/form.entity';
import { Tenant } from '../tenant/tenant.entity';
import { TransformCollection } from '@okampus/api/shards';
import { RoleCategory, ControlType, FormType, TeamType } from '@okampus/shared/enums';

import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';

import { randomId, toSlug } from '@okampus/shared/utils';

import type { TeamOptions } from './team.options';
import type { BankAccount } from './bank-account/bank-account.entity';
import type { Role } from './role/role.entity';
import type { TeamHistory } from './team-history/team-history.entity';
import type { TenantOrganize } from '../tenant/tenant-organize/tenant-organize.entity';
import type { Action } from './action/action.entity';
import type { Document } from '../team/document/document.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Pole } from './pole/pole.entity';
import type { Searchable } from '../../types/search-entity.type';
import type { Finance } from './finance/finance.entity';
import type { TeamJoin } from './team-join/team-join.entity';
import type { TeamMember } from './team-member/team-member.entity';
import type { LegalUnit } from '../actor/legal-unit/legal-unit.entity';
import type { EventOrganize } from '../event/event-organize/event-organize.entity';

@Entity({ customRepository: () => TeamRepository })
export class Team extends TenantScopedEntity implements Searchable {
  [EntityRepositoryType]!: TeamRepository;

  @Enum({ items: () => TeamType, type: EnumType, default: TeamType.Club })
  type = TeamType.Club;

  @Unique()
  @Property({ type: 'text' }) // TODO: implement unique by tenant
  slug!: string;

  // TODO: long-term, convert to currency + amount + manage payments
  @Property({ type: 'float', default: 0 })
  membershipFees = 0;

  // ISO 8601 duration format (PnYnMnDTnHnMnS) / '' if forever
  @Property({ type: 'text', default: '' })
  membershipDuration = '';

  @Property({ type: 'text', default: RoleCategory.Directors })
  directorsCategoryName: string = RoleCategory.Directors;

  @Property({ type: 'text', default: RoleCategory.Managers })
  managersCategoryName: string = RoleCategory.Managers;

  @Property({ type: 'text', default: RoleCategory.Members })
  membersCategoryName: string = RoleCategory.Members;

  @Property({ type: 'text', nullable: true, default: null })
  expectingPresidentEmail: string | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  expectingTreasurerEmail: string | null = null;

  @Property({ type: 'text', nullable: true, default: null })
  expectingSecretaryEmail: string | null = null;

  @Property({ type: 'boolean', default: true })
  isOnboardingComplete = true;

  @Property({ type: 'boolean', default: true })
  isJoinFormActive = true;

  @OneToOne({ type: 'Form', inversedBy: 'team' })
  joinForm: Form;

  @OneToOne({ type: 'Actor', inversedBy: 'team' })
  actor: Actor;

  @OneToOne({ type: 'Tenant', mappedBy: 'adminTeam' })
  adminTenant?: Tenant;

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  tenantGrantFund: LegalUnit | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  video: FileUpload | null = null;

  @ManyToOne({ type: 'Team', nullable: true, default: null })
  parent: Team | null = null;

  @OneToMany({ type: 'Team', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Team>(this);

  @OneToMany({ type: 'Document', mappedBy: 'team' })
  @TransformCollection()
  documents = new Collection<Document>(this);

  @OneToMany({ type: 'Action', mappedBy: 'team' })
  @TransformCollection()
  actions = new Collection<Action>(this);

  @OneToMany({ type: 'BankAccount', mappedBy: 'team' })
  @TransformCollection()
  bankAccounts = new Collection<BankAccount>(this);

  @OneToMany({ type: 'EventOrganize', mappedBy: 'team' })
  @TransformCollection()
  eventOrganizes = new Collection<EventOrganize>(this);

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

  @OneToMany({ type: 'TenantOrganize', mappedBy: 'team' })
  @TransformCollection()
  tenantOrganizes = new Collection<TenantOrganize>(this);

  @OneToMany({ type: 'Role', mappedBy: 'team' })
  @TransformCollection()
  roles = new Collection<Role>(this);

  @OneToMany({ type: 'Pole', mappedBy: 'team' })
  @TransformCollection()
  poles = new Collection<Pole>(this);

  constructor(options: TeamOptions) {
    super(options);
    this.assign(options);

    if (!options.slug) this.slug = toSlug(`${options.name}-${randomId()}`);

    this.actor = new Actor({
      name: options.name,
      bio: options.bio,
      email: options.email,
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
          placeholder: '',
          required: true,
        },
      ],
      team: this,
      type: FormType.Team,
      isAllowingEditingAnswers: true,
      isAllowingMultipleAnswers: false,
      createdBy: options.createdBy,
      tenant: options.tenant,
    });
  }
}
