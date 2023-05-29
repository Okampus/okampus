// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadsService } from './uploads.service';

import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { Buckets } from '@okampus/shared/enums';
import { enumChecker } from '@okampus/shared/utils';
import type { MulterFile } from '@okampus/shared/types';
import type { FileUpload } from '@okampus/api/dal';

const isBucket = enumChecker(Buckets);

@Resolver('FileUpload')
export class UploadsResolver {
  constructor(private readonly uploadsService: UploadsService) {}

  @Mutation()
  public async singleUpload(
    @Args('file', { type: () => GraphQLUpload }) file: MulterFile,
    @Args('bucket', { nullable: true }) bucket: string = Buckets.Attachments
  ): Promise<FileUpload> {
    if (!isBucket(bucket)) throw new BadRequestException(`Invalid bucket ${bucket}`);
    const fileUpload = await this.uploadsService.createUpload(file, bucket);
    return fileUpload;
  }
}
