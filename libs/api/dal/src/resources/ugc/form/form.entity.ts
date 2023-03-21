import { FormRepository } from './form.repository';
import { Ugc } from '../ugc.entity';
import { FormEdit } from '../../edit/form-edit/form-edit.entity';

import { Entity, Enum, Property } from '@mikro-orm/core';
import { FormType, UgcKind } from '@okampus/shared/enums';

import { diffJson } from 'diff';

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

  // TODO: add "can answers be edited after submission?" option
  // TODO: add unique answers per user

  @Property({ type: 'boolean' })
  undeletable = false;

  constructor(options: FormOptions & { undeletable?: boolean }) {
    super({ ...options, ugcKind: UgcKind.Form });
    this.assign({ ...options, ugcKind: UgcKind.Form });

    this.edits.add([
      new FormEdit({
        newVersion: options.schema,
        addedDiff: diffJson({}, options.schema),
        createdBy: options.createdBy,
        linkedUgc: this,
        tenant: options.tenant,
      }),
    ]);
  }
}
