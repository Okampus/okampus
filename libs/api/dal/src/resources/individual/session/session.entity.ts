import { TenantScopedEntity } from '../..';
import { BotInfoRepository } from '../bot-info/bot-info.repository';
import { Entity, EntityRepositoryType, Enum, EnumType, JsonType, ManyToOne, Property } from '@mikro-orm/core';
import { SessionClientType } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { UserInfo } from '../user-info/user-info.entity';
import type { SessionOptions } from './session.options';

@Entity({ customRepository: () => BotInfoRepository })
export class Session extends TenantScopedEntity {
  [EntityRepositoryType]!: BotInfoRepository;

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

  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @Property({ type: 'date' })
  lastActivityAt: Date = new Date();

  @Property({ type: 'date' })
  lastIssuedAt: Date = new Date();

  @Property({ type: 'date', nullable: true, default: null })
  revokedAt: Date | null = null;

  @Property({ type: 'date', nullable: true, default: null })
  expiredAt: Date | null = null;

  constructor(options: SessionOptions) {
    super(options);
    this.assign(options);
  }
}
