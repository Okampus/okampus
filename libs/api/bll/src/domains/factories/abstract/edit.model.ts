/* eslint-disable import/no-cycle */
import { TenantScopedModel, UgcModel } from '../index';
import { Paginated } from '../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

import { EditKind } from '@okampus/shared/enums';

import type { IEdit, IUgc } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@ObjectType()
export class EditModel extends TenantScopedModel implements IEdit {
  @Field(() => EditKind)
  editKind!: EditKind;

  @Field(() => GraphQLJSON)
  addedDiff!: JSONObject;

  @Field(() => UgcModel)
  linkedUgc?: IUgc;

  constructor(edit: IEdit) {
    if (!edit.tenant) throw new Error('Edit must have a tenant');
    super(edit.tenant);
  }
}

@ObjectType()
export class PaginatedEditModel extends Paginated(EditModel) {}
