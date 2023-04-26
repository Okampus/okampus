import { FormEdit } from './form-edit/form-edit.entity';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Collection, Entity, Enum, EnumType, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { FormType } from '@okampus/shared/enums';

import { diffJson } from 'diff';

import type { JSONObject } from '@okampus/shared/types';
import type { FormOptions } from './form.options';
import type { Team } from '../team/team.entity';

@Entity()
export class Form extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @OneToOne({ type: 'Team', mappedBy: 'joinForm', nullable: true })
  team: Team | null = null;

  @Property({ type: 'json' })
  schema!: JSONObject;

  @Enum({ items: () => FormType, type: EnumType })
  type!: FormType;

  @Property({ type: 'boolean' })
  isTemplate = false;

  @Property({ type: 'boolean' })
  isEnabled = true;

  @Property({ type: 'boolean' })
  isAllowingMultipleAnswers = false;

  @Property({ type: 'boolean' })
  isAllowingEditingAnswers = true;

  @Property({ type: 'boolean' })
  isRequired = false;

  @OneToMany({ type: 'FormEdit', mappedBy: 'form' })
  @TransformCollection()
  formEdits = new Collection<FormEdit>(this);

  constructor(options: FormOptions & { undeletable?: boolean }) {
    super(options);
    this.assign(options);

    this.formEdits.add([
      new FormEdit({
        newVersion: options.schema,
        addedDiff: diffJson({}, options.schema),
        createdBy: options.createdBy,
        form: this,
        tenant: options.tenant,
      }),
    ]);
  }
}
