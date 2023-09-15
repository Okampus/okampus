// eslint-disable-next-line import/no-cycle
import { RequiredRoleRepository } from './required-role.repository';
import { TenantScopedHiddableEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';

import { TeamType } from '@okampus/shared/enums';

import type { RequiredRoleOptions } from './required-role.options';

@Entity({ customRepository: () => RequiredRoleRepository })
export class RequiredRole extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: RequiredRoleRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Enum({ items: () => TeamType, array: true, default: [] })
  teamTypes: TeamType[] = [];

  @Property({ type: 'boolean', default: false })
  isRequired = false;

  constructor(options: RequiredRoleOptions) {
    super(options);
    this.assign(options);
  }
}
