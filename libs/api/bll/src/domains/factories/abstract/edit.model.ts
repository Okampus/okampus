/* eslint-disable import/no-cycle */
import { TenantScopedModel, UgcModel } from '../index';
import { Paginated } from '../../../shards/types/paginated.type';

import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';

import { EditKind } from '@okampus/shared/enums';

import type { IEdit, IUgc } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@InterfaceType({
  resolveType: (value) => {
    if (value.editKind === EditKind.FormEdit) return 'FormEdit';
    if (value.editKind === EditKind.ContentEdit) return 'ContentEdit';
    if (value.editKind === EditKind.DocumentEdit) return 'DocumentEdit';
    if (value.editKind === EditKind.FormSubmissionEdit) return 'DocumentEdit';
    return 'EditModel';
  },
})
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
