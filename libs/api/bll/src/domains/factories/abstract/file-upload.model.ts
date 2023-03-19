/* eslint-disable import/no-cycle */
import { IndividualModel } from '../index';
import { TenantScopedModel } from '../index';
import { Field, GraphQLISODateTime, Int, InterfaceType } from '@nestjs/graphql';
import { FileUploadKind } from '@okampus/shared/enums';
import type { IFileUpload, IIndividual } from '@okampus/shared/dtos';

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
    if (!fileUpload.tenant) throw new Error('FileUpload must have a tenant');
    super(fileUpload.tenant);
    this.assign(fileUpload);
  }
}
