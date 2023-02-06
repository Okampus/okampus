import { IndividualModel } from './individual.model';
import { TenantScopedModel } from './tenant-scoped.model';
import { Field, GraphQLISODateTime, Int, InterfaceType } from '@nestjs/graphql';
import { FileUploadKind } from '@okampus/shared/enums';
import type { IFileUpload, IIndividual, ITenantCore } from '@okampus/shared/dtos';
// eslint-disable-next-line import/no-cycle

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
