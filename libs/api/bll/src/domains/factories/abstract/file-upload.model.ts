import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { IFileUpload, IIndividual, ITenantCore } from '@okampus/shared/dtos';
import { FileUploadKind } from '@okampus/shared/enums';
import { IndividualModel } from './individual.model';
// eslint-disable-next-line import/no-cycle
import { TenantScopedModel } from './tenant-scoped.model';

@ObjectType()
export abstract class FileUploadModel extends TenantScopedModel implements IFileUpload {
  @Field(() => FileUploadKind)
  fileUploadKind!: FileUploadKind;

  @Field(() => IndividualModel, { nullable: true })
  uploadedBy?: IIndividual;

  @Field(() => GraphQLISODateTime)
  lastModifiedAt!: Date;

  @Field(() => String)
  url!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  size!: number;

  @Field(() => String)
  mime!: string;

  constructor(fileUpload: IFileUpload) {
    super(fileUpload.tenant as ITenantCore);
    this.assign(fileUpload);
  }
}
