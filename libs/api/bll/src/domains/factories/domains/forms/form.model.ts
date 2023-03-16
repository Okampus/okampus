// eslint-disable-next-line import/no-cycle
import { FormEditModel } from './form-edit.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { FormType } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import type { IForm, IFormEdit } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@ObjectType({ implements: () => [UgcModel] })
export class FormModel extends UgcModel implements IForm {
  @Field(() => String)
  name!: string;

  @Field(() => GraphQLJSON)
  schema!: JSONObject;

  @Field(() => FormType)
  type!: FormType;

  @Field(() => Boolean)
  isTemplate!: boolean;

  @Field(() => [FormEditModel])
  edits!: IFormEdit[];

  @Field(() => Boolean)
  undeletable!: boolean;

  constructor(form: IForm) {
    super(form);
    this.assign(form);
  }
}

@ObjectType()
export class PaginatedFormModel extends Paginated(FormModel) {}
