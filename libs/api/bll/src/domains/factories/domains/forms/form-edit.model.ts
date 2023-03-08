import { FormModel } from './form.model';
import { Paginated } from '../../../../shards/types/paginated.type';
import { UgcModel } from '../../abstract/ugc.model';
import { IndividualModel } from '../../abstract/individual.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-scalars';
import type { IForm, IFormEdit, IIndividual } from '@okampus/shared/dtos';
import type { JSONObject } from '@okampus/shared/types';

@ObjectType({ implements: () => [UgcModel] })
export class FormEditModel extends TenantScopedModel implements IFormEdit {
  @Field(() => GraphQLJSON)
  addedDiff!: JSONObject;

  @Field(() => GraphQLJSON)
  newVersion!: JSONObject;

  @Field(() => Int)
  order!: number;

  @Field(() => FormModel)
  linkedForm!: IForm;

  @Field(() => IndividualModel)
  editedBy!: IIndividual;

  constructor(formEdit: IFormEdit) {
    if (!formEdit.tenant) throw new Error('DocumentEdit must have a tenant');
    super(formEdit.tenant);
  }
}

@ObjectType()
export class PaginatedFormEditModel extends Paginated(FormEditModel) {}
