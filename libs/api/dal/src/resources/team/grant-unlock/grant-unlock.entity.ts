import { GrantUnlockRepository } from './grant-unlock.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { FinanceState } from '@okampus/shared/enums';

import type { GrantUnlockOptions } from './grant-unlock.options';
import type { Grant } from '../grant/grant.entity';
import type { Finance } from '../finance/finance.entity';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from 'graphql-upload-minimal';

@Entity({ customRepository: () => GrantUnlockRepository })
export class GrantUnlock extends TenantScopedEntity {
  [EntityRepositoryType]!: GrantUnlockRepository;

  @Property({ type: 'float' })
  amountAsked!: number;

  @Property({ type: 'float' })
  amountGiven!: number;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state = FinanceState.Completed;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  validatedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  validatedAt: Date | null = null;

  @ManyToOne({ type: 'Grant' })
  grant!: Grant;

  @ManyToOne({ type: 'Finance', nullable: true, default: null })
  finance: Finance | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  signature: FileUpload | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  generatedDocument: FileUpload | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  constructor(options: GrantUnlockOptions) {
    super(options);
    this.assign(options);
  }
}
