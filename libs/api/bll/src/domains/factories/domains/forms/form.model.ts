import { Field, ObjectType } from '@nestjs/graphql';
import type { IForm } from '@okampus/shared/dtos';
import { FormType } from '@okampus/shared/enums';
import type { JSONObject } from '@okampus/shared/types';
import { GraphQLJSON } from 'graphql-scalars';
import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';

@ObjectType({ implements: () => [UgcModel] })
export class FormModel extends UgcModel implements IForm {
  @Field(() => String)
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

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
