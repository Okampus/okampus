import { UploadsService } from './uploads.service';
import { RequestContext } from '../../shards/abstract/request-context';

import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { Buckets, EntityName } from '@okampus/shared/enums';
import { enumChecker } from '@okampus/shared/utils';

import type { FileUpload } from '@okampus/api/dal';
import type { MulterFile } from '@okampus/shared/types';

const isBucket = enumChecker(Buckets);
// const actorEntities = [EntityName.Team, EntityName.User, EntityName.Bot] as const;
// const thumbnailsEntities = [EntityName.Tag, EntityName.Location, EntityName.Event, EntityName.Project] as const;
// const receiptsEntities = [EntityName.Grant, EntityName.Expense, EntityName.ExpenseItem, EntityName.Finance] as const;
// const attachmentsEntities = [EntityName.Content, EntityName.GrantUnlock] as const;

// function ensureEntityName<T extends ReadonlyArray<string>>(
//   entityName: string | null,
//   entityId: string,
//   entities: T
// ): entityName is T[number] {
//   if (!entityName || !includes(entityName, entities)) throw new BadRequestException(`Invalid entity: ${entityName}.`);
//   return entityId !== '';
// }

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
    @Args('bucket', { nullable: true }) bucket: string = Buckets.Attachments
  ): Promise<FileUpload> {
    if (!isBucket(bucket)) throw new BadRequestException(`Invalid bucket ${bucket}`);

    if (bucket === Buckets.Signatures)
      return await this.uploadsService.uploadSignature(file, this.requester(), this.tenant());

    const context = { createdBy: this.requester(), tenant: this.tenant(), entityName, entityId };
    if (bucket === Buckets.ActorImages)
      return await this.uploadsService.createImageUpload(file, Buckets.ActorImages, context, 300);

    if (bucket === Buckets.ActorDocuments)
      return await this.uploadsService.createUpload(file, Buckets.ActorDocuments, context);

    if (bucket === Buckets.ActorVideos)
      return await this.uploadsService.createUpload(file, Buckets.ActorVideos, context);

    if (bucket === Buckets.Thumbnails)
      return await this.uploadsService.createImageUpload(file, Buckets.Thumbnails, context, 200);

    if (bucket === Buckets.Receipts) return await this.uploadsService.createUpload(file, Buckets.Receipts, context);

    if (bucket === Buckets.Attachments)
      return await this.uploadsService.createUpload(file, Buckets.Attachments, context);

    if (bucket === Buckets.Banners)
      return await this.uploadsService.createImageUpload(file, Buckets.Banners, context, 400);

    throw new BadRequestException(`Invalid bucket ${bucket}`);
  }
}
