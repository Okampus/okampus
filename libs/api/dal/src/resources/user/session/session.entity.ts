import { SessionRepository } from './session.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, JsonType, ManyToOne, Property } from '@mikro-orm/core';
import { SessionClientType } from '@okampus/shared/enums';

import type { SessionOptions } from './session.options';
import type { User } from '../user.entity';
import type { JSONObject } from '@okampus/shared/types';
@Entity({ customRepository: () => SessionRepository })
export class Session extends TenantScopedEntity {
  [EntityRepositoryType]!: SessionRepository;

  @Property({ type: 'string' })
  ip!: string;

  @Property({ type: 'string' })
  country!: string;

  @Enum({ items: () => SessionClientType, type: EnumType })
  clientType!: SessionClientType;

  @Property({ type: JsonType })
  userAgent!: JSONObject;

  @Property({ type: 'string', hidden: true })
  refreshTokenHash!: string;

  @Property({ type: 'string', hidden: true })
  tokenFamily!: string;

  @ManyToOne({ type: 'User' })
  user!: User;

  @Property({ type: 'datetime', defaultRaw: 'current_timestamp' })
  lastActivityAt: Date = new Date();

  @Property({ type: 'datetime', defaultRaw: 'current_timestamp' })
  lastIssuedAt: Date = new Date();

  @Property({ type: 'datetime', nullable: true, default: null })
  revokedAt: Date | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  expiredAt: Date | null = null;

  constructor(options: SessionOptions) {
    super(options);
    this.assign(options);
  }
}
