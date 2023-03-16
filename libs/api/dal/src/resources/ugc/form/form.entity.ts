import { FormRepository } from './form.repository';
import { Ugc } from '../ugc.entity';
import { FormEdit } from '../form-edit/form-edit.entity';
import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import { FormType } from '@okampus/shared/enums';

import type { JSONObject } from '@okampus/shared/types';
import type { FormOptions } from './form.options';

@Entity({ customRepository: () => FormRepository })
export class Form extends Ugc {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'json' })
  schema!: JSONObject;

  @Enum({ items: () => FormType, type: 'string' })
  type!: FormType;

  @Property({ type: 'boolean' })
  isTemplate = false;

  @OneToMany({ type: 'FormEdit', mappedBy: 'linkedForm' })
  edits = new Collection<FormEdit>(this);
  // TODO: add can answers be edited after submission
  // TODO: add unique answers per user
  // TODO: add lastEdit

  @Property({ type: 'boolean' })
  undeletable = false;

  constructor(options: FormOptions & { undeletable?: boolean }) {
    super({ ...options, ugcKind: UgcKind.Form });

    this.edits.add(
      new FormEdit({
        addedDiff: options.schema,
        newVersion: options.schema,
        editedBy: options.realAuthor,
        linkedForm: this,
        order: 0,
        tenant: options.tenant,
      })
    );

    this.assign({ ...options, ugcKind: UgcKind.Form });
  }
}
