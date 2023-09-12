import { FormRepository } from './form.repository';
import { TenantScopedHiddableEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';
import { FormType } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormOptions } from './form.options';
import type { Team } from '../team/team.entity';

@Entity({ customRepository: () => FormRepository })
export class Form extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: FormRepository;

  @Property({ type: 'text' })
  name!: string;

  @OneToOne({ type: 'Team', mappedBy: 'joinForm' })
  team?: Team;

  @Property({ type: 'json' })
  schema!: JSONObject;

  @Enum({ items: () => FormType, type: EnumType })
  type!: FormType;

  @Property({ type: 'boolean', default: true })
  isEnabled = true;

  @Property({ type: 'boolean', default: false })
  isAllowingMultipleAnswers = false;

  @Property({ type: 'boolean', default: true })
  isAllowingEditingAnswers = true;

  @Property({ type: 'boolean', default: false })
  isLocked = false;

  constructor(options: FormOptions) {
    super(options);
    this.assign(options);
  }
}
