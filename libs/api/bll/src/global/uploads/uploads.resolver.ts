import { UploadsService } from './uploads.service';
import { RequestContext } from '../../shards/abstract/request-context';

import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-ts';

import { BucketNames, EntityName } from '@okampus/shared/enums';
import { enumChecker } from '@okampus/shared/utils';

import type { FileUpload } from '@okampus/api/dal';
import type { MulterFile } from '@okampus/shared/types';

const isBucket = enumChecker(BucketNames);

@Resolver('FileUpload')
export class UploadsResolver extends RequestContext {
  constructor(private readonly uploadsService: UploadsService) {
    super();
  }

  @Mutation()
  public async singleUpload(
    @Args('file', { type: () => GraphQLUpload }) file: MulterFile,
    @Args('entityName', { nullable: true }) entityName: EntityName,
    @Args('entityId', { nullable: true }) entityId: string | null = null,
    @Args('bucket', { nullable: true }) bucket: string = BucketNames.Attachments,
  ): Promise<FileUpload> {
    if (!isBucket(bucket)) throw new BadRequestException(`Invalid bucket ${bucket}`);

    if (bucket === BucketNames.Signatures)
      return await this.uploadsService.uploadSignature(file, this.requester(), this.tenant());

    const context = { createdBy: this.requester(), tenantScope: this.tenant(), entityName, entityId };
    if (bucket === BucketNames.ActorImages)
      return await this.uploadsService.createImageUpload(file, BucketNames.ActorImages, context, 300);

    if (bucket === BucketNames.ActorDocuments)
      return await this.uploadsService.createUpload(file, BucketNames.ActorDocuments, context);

    if (bucket === BucketNames.ActorVideos)
      return await this.uploadsService.createUpload(file, BucketNames.ActorVideos, context);

    if (bucket === BucketNames.Thumbnails)
      return await this.uploadsService.createImageUpload(file, BucketNames.Thumbnails, context, 200);

    if (bucket === BucketNames.Receipts)
      return await this.uploadsService.createUpload(file, BucketNames.Receipts, context);

    if (bucket === BucketNames.Attachments)
      return await this.uploadsService.createUpload(file, BucketNames.Attachments, context);

    if (bucket === BucketNames.Banners)
      return await this.uploadsService.createImageUpload(file, BucketNames.Banners, context, 400);

    throw new BadRequestException(`Invalid bucket ${bucket}`);
  }
}
