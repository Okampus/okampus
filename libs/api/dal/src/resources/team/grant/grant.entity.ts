import { GrantRepository } from './grant.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { FinanceState } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { GrantOptions } from './grant.options';
import type { Project } from '../../project/project.entity';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from 'graphql-upload-minimal';

@Entity({ customRepository: () => GrantRepository })
export class Grant extends TenantScopedEntity {
  [EntityRepositoryType]!: GrantRepository;

  @Property({ type: 'float' })
  askedAmount!: number;

  @Property({ type: 'float' })
  receivedAmount!: number;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state = FinanceState.Completed;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  receivedAmountProcessedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  receivedAmountProcessedAt: Date | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  signature: FileUpload | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  generatedDocument: FileUpload | null = null;

  @OneToMany({ type: 'Project', mappedBy: 'grant' })
  @TransformCollection()
  projects = new Collection<Project>(this);

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  constructor(options: GrantOptions) {
    super(options);
    this.assign(options);
  }
}
