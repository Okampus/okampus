import { FormRepository } from './form.repository';
import { Ugc } from '../ugc.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';
import { UgcKind } from '@okampus/shared/enums';
import { FormType } from '@okampus/shared/enums';
import type { JSONObject } from '@okampus/shared/types';
import type { FormOptions } from './form.options';

@Entity({
  customRepository: () => FormRepository,
})
export class Form extends Ugc {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'json' })
  schema!: JSONObject;

  @Enum({ items: () => FormType, type: 'string' })
  type!: FormType;

  @Property()
  isTemplate!: boolean;

  // TODO: add can answers be edited after submission
  // TODO: add unique answers per user

  constructor(options: FormOptions) {
    super({ ...options, ugcKind: UgcKind.Form });
    this.assign({ ...options, ugcKind: UgcKind.Form });
  }
}
