import { Entity, Enum, JsonType, ManyToOne, Property } from '@mikro-orm/core';
import { SessionClientType } from '@okampus/shared/enums';
import type { JSONObject } from '@okampus/shared/types';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import type { User } from '../../actor/user/user.entity';
import type { SessionOptions } from './session.options';

import { SessionRepository } from './session.repository';

@Entity({
  customRepository: () => SessionRepository,
})
export class Session extends TenantScopedEntity {
  @Property({ type: 'string' })
  ip!: string;

  @Property({ type: 'string' })
  country!: string;

  @Enum(() => SessionClientType)
  clientType!: SessionClientType;

  @Property({ type: JsonType })
  userAgent!: JSONObject;

  @Property({ type: 'string', hidden: true })
  refreshTokenHash!: string;

  @Property({ type: 'string', hidden: true })
  tokenFamily!: string;

  @ManyToOne({ type: 'User' })
  user!: User;

  @Property({ type: 'date' })
  lastActivityAt: Date = new Date();

  @Property({ type: 'date' })
  lastIssuedAt: Date = new Date();

  @Property({ type: 'date', nullable: true })
  revokedAt: Date | null = null;

  @Property({ type: 'date', nullable: true })
  expiredAt: Date | null = null;

  constructor(options: SessionOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
