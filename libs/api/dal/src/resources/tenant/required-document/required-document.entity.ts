// eslint-disable-next-line import/no-cycle
import { RequiredDocumentRepository } from './required-document.repository';
import { TenantScopedHiddableEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';

import { TeamType } from '@okampus/shared/enums';

import type { RequiredDocumentOptions } from './required-document.options';

@Entity({ customRepository: () => RequiredDocumentRepository })
export class RequiredDocument extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: RequiredDocumentRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Enum({ items: () => TeamType, array: true, default: [] })
  teamTypes: TeamType[] = [];

  @Property({ type: 'boolean', default: false })
  isRequired = false;

  constructor(options: RequiredDocumentOptions) {
    super(options);
    this.assign(options);
  }
}
