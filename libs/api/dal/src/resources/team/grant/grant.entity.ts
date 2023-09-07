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
import { TransactionState } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { GrantOptions } from './grant.options';
import type { Project } from '../../team/project/project.entity';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity({ customRepository: () => GrantRepository })
export class Grant extends TenantScopedEntity {
  [EntityRepositoryType]!: GrantRepository;

  @Property({ type: 'float' })
  askedAmount!: number;

  @Property({ type: 'float' })
  receivedAmount!: number;

  @Enum({ items: () => TransactionState, default: TransactionState.Completed, type: EnumType })
  state = TransactionState.Completed;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  receivedAmountProcessedBy: User | null = null;

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
