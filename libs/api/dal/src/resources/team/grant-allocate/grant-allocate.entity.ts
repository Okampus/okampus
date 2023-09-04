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
import { TransactionState } from '@okampus/shared/enums';

import type { GrantAllocateOptions } from './grant-allocate.options';
import type { Grant } from '../grant/grant.entity';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Transaction } from '../../actor/transaction/transaction.entity';

@Entity({ customRepository: () => GrantAllocateRepository })
export class GrantAllocate extends TenantScopedEntity {
  [EntityRepositoryType]!: GrantAllocateRepository;

  @Property({ type: 'float' })
  askedAmount!: number;

  @Property({ type: 'float', nullable: true, default: null })
  receivedAmount: number | null = null;

  @Enum({ items: () => TransactionState, default: TransactionState.Completed, type: EnumType })
  state = TransactionState.Completed;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  receivedAmountProcessedBy: User | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  receivedAmountProcessedAt: Date | null = null;

  @ManyToOne({ type: 'Grant' })
  grant!: Grant;

  @ManyToOne({ type: 'Transaction', nullable: true, default: null })
  transaction: Transaction | null = null;

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
