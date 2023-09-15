import { FormRepository } from './form.repository';
import { TenantScopedHiddableEntity } from '../tenant-scoped.entity';
import { Entity, EntityRepositoryType, OneToOne, Property } from '@mikro-orm/core';

import type { FormOptions } from './form.options';
import type { Team } from '../team/team.entity';
import type { FormSchema } from '@okampus/shared/types';

@Entity({ customRepository: () => FormRepository })
export class Form extends TenantScopedHiddableEntity {
  [EntityRepositoryType]!: FormRepository;

  @OneToOne({ type: 'Team', mappedBy: 'joinForm' })
  team?: Team;

  @Property({ type: 'json' })
  schema!: FormSchema;

  @Property({ type: 'boolean', default: true })
  isEnabled = true;

  @Property({ type: 'boolean', default: true })
  isAllowingEditingAnswers = true;

  @Property({ type: 'boolean', default: false })
  isAllowingMultipleAnswers = false;

  @Property({ type: 'boolean', default: false })
  isLocked = false;

  constructor(options: FormOptions) {
    super(options);
    this.assign(options);
  }
}
