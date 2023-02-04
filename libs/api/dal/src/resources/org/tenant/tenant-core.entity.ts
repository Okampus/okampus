import { OidcInfo } from '@okampus/shared/dtos';
import { Embedded, Entity, Property, Unique } from '@mikro-orm/core';
import { toSlug } from '@okampus/shared/utils';
import type { TenantCoreOptions } from './tenant-core.options';
import { BaseEntity } from '../../../shards/abstract/base/base.entity';

import { TenantCoreRepository } from './tenant-core.repository';

@Entity({
  customRepository: () => TenantCoreRepository,
})
export class TenantCore extends BaseEntity {
  @Unique()
  @Property({ type: 'text' })
  domain!: string;

  @Property({ type: 'text' })
  name!: string;

  @Embedded(() => OidcInfo)
  oidcInfo = new OidcInfo({});

  constructor(options: TenantCoreOptions) {
    options.domain = toSlug(options.domain ?? options.name);

    super();
    this.assign(options);
  }
}
