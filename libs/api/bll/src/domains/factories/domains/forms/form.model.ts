import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { FormType } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import type { IForm } from '@okampus/shared/dtos';
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

  constructor(form: IForm) {
    super(form);
    this.assign(form);
  }
}

@ObjectType()
export class PaginatedFormModel extends Paginated(FormModel) {}
