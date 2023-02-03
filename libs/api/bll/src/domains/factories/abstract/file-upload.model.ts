import { Field, GraphQLISODateTime, Int, InterfaceType, ObjectType } from '@nestjs/graphql';
import { IFileUpload, IIndividual, ITenantCore } from '@okampus/shared/dtos';
import { FileUploadKind } from '@okampus/shared/enums';
import { IndividualModel } from './individual.model';
// eslint-disable-next-line import/no-cycle
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType({
  resolveType: (value) => {
    if (value.fileUploadKind === FileUploadKind.DocumentUpload) {
      return 'DocumentUploadModel';
    }
    if (value.fileUploadKind === FileUploadKind.ImageUpload) {
      return 'ImageUploadModel';
    }
    if (value.fileUploadKind === FileUploadKind.VideoUpload) {
      return 'VideoUploadModel';
    }
    return 'FileUploadModel';
  },
})
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
