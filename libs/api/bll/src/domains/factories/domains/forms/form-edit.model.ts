/* eslint-disable import/no-cycle */
import { EditModel, FormModel } from '../../index';
import { UgcModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';

import { Field, ObjectType } from '@nestjs/graphql';
import { EditKind } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';

import type { IForm, IFormEdit } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@ObjectType({ implements: () => [UgcModel] })
export class FormEditModel extends EditModel implements IFormEdit {
  @Field(() => GraphQLJSON)
  newVersion!: JSONObject;

  @Field(() => FormModel)
  linkedForm!: IForm;

  constructor(formEdit: IFormEdit) {
    super(formEdit);
    this.assign(formEdit);

    this.editKind = EditKind.FormEdit;
  }
}

@ObjectType()
export class PaginatedFormEditModel extends Paginated(FormEditModel) {}
