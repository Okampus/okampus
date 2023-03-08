import { FormRepository } from './form.repository';
import { Ugc } from '../ugc.entity';
import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import { FormType } from '@okampus/shared/enums';
import type { FormEdit } from '../form-edit/form-edit.entity';

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

  @Property()
  isTemplate!: boolean;

  // TODO: add lastEdit

  @OneToMany({ type: 'FormEdit', mappedBy: 'linkedForm' })
  edits = new Collection<FormEdit>(this);
  // TODO: add can answers be edited after submission
  // TODO: add unique answers per user

  @Property({ type: 'boolean' })
  undeletable = false;

  constructor(options: FormOptions & { undeletable?: boolean }) {
    super({ ...options, ugcKind: UgcKind.Form });
    this.assign({ ...options, ugcKind: UgcKind.Form });
  }
}
