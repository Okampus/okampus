import { FormRepository } from './form.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { FormType } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormOptions } from './form.options';
import type { Team } from '../team/team.entity';

@Entity({ customRepository: () => FormRepository })
export class Form extends TenantScopedEntity {
  [EntityRepositoryType]!: FormRepository;

  @Property({ type: 'text' })
  name!: string;

  @OneToOne({ type: 'Team', inversedBy: 'joinForm', nullable: true })
  team: Team | null = null;

  @Property({ type: 'json' })
  schema!: JSONObject;

  @Enum({ items: () => FormType, type: EnumType })
  type!: FormType;

  @Property({ type: 'boolean' })
  isEnabled = true;

  @Property({ type: 'boolean' })
  isAllowingMultipleAnswers = false;

  @Property({ type: 'boolean' })
  isAllowingEditingAnswers = true;

  @Property({ type: 'boolean' })
  isRequired = false;

  constructor(options: FormOptions & { undeletable?: boolean }) {
    super(options);
    this.assign(options);
  }
}
