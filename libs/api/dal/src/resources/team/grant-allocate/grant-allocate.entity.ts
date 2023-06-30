import { GrantAllocateRepository } from './grant-allocate.repository';
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

import type { GrantAllocateOptions } from './grant-allocate.options';
import type { Grant } from '../grant/grant.entity';
import type { Finance } from '../finance/finance.entity';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from 'graphql-upload-minimal';

@Entity({ customRepository: () => GrantAllocateRepository })
export class GrantAllocate extends TenantScopedEntity {
  [EntityRepositoryType]!: GrantAllocateRepository;

  @Property({ type: 'float' })
  askedAmount!: number;

  @Property({ type: 'float', nullable: true, default: null })
  receivedAmount: number | null = null;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state = FinanceState.Completed;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  receivedAmountProcessedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  receivedAmountProcessedAt: Date | null = null;

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

  constructor(options: GrantAllocateOptions) {
    super(options);
    this.assign(options);
  }
}
