// eslint-disable-next-line import/no-cycle
import { EditModel, FormEditModel } from '../../index';
import { Paginated } from '../../../../shards/types/paginated.type';
import { Field, ObjectType } from '@nestjs/graphql';

import type { IContentEdit } from '@okampus/shared/dtos';

@ObjectType({ implements: () => [EditModel] })
export class ContentEditModel extends EditModel implements IContentEdit {
  @Field(() => String)
  newVersion!: string;

  @Field(() => String, { nullable: true })
  note: string | null = null;

  @Field(() => FormEditModel)
  linkedFormEdit!: FormEditModel;

  constructor(contentEdit: IContentEdit) {
    super(contentEdit);
    this.assign(contentEdit);
  }
}

@ObjectType()
export class PaginatedContentEditModel extends Paginated(ContentEditModel) {}
