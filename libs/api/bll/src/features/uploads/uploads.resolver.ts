import { UploadsService } from './uploads.service';
import { RequestContext } from '../../shards/abstract/request-context';

import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { Buckets, EntityName } from '@okampus/shared/enums';
import { enumChecker, includes } from '@okampus/shared/utils';
import type { MulterFile } from '@okampus/shared/types';
import type { FileUpload } from '@okampus/api/dal';

const isBucket = enumChecker(Buckets);
const actorEntities = [EntityName.Team, EntityName.User, EntityName.Bot] as const;
const thumbnailsEntities = [EntityName.Tag, EntityName.Location] as const;
const receiptsEntities = [EntityName.Grant, EntityName.Expense, EntityName.ExpenseItem, EntityName.Finance] as const;
const attachmentsEntities = [EntityName.Content, EntityName.GrantUnlock] as const;

function ensureEntityName<T extends ReadonlyArray<string>>(
  entityName: string | null,
  entityId: string,
  entities: T
): entityName is T[number] {
  if (!entityName || !includes(entityName, entities)) throw new BadRequestException(`Invalid entity: ${entityName}.`);
  return entityId !== '';
}

@Resolver('FileUpload')
export class UploadsResolver extends RequestContext {
  constructor(private readonly uploadsService: UploadsService) {
    super();
  }

  @Mutation()
  public async singleUpload(
    @Args('file', { type: () => GraphQLUpload }) file: MulterFile,
    @Args('bucket', { nullable: true }) bucket: string = Buckets.Attachments,
    @Args('entityName', { nullable: true }) entityName: EntityName | null = null,
    @Args('entityId', { nullable: true }) entityId: string | null = null
  ): Promise<FileUpload> {
    if (!isBucket(bucket)) throw new BadRequestException(`Invalid bucket ${bucket}`);

    if (bucket === Buckets.Signatures)
      return await this.uploadsService.uploadSignature(file, this.requester(), this.tenant());

    if (!entityId) throw new BadRequestException(`Missing entityId`);
    if (bucket === Buckets.ActorImages && ensureEntityName(entityName, entityId, actorEntities))
      return await this.uploadsService.uploadActorImage(file, entityName, entityId, this.requester(), this.tenant());

    if (bucket === Buckets.ActorDocuments && ensureEntityName(entityName, entityId, actorEntities))
      return await this.uploadsService.uploadActorDocument(file, entityName, entityId, this.requester(), this.tenant());

    if (bucket === Buckets.ActorVideos && ensureEntityName(entityName, entityId, actorEntities))
      return await this.uploadsService.uploadActorVideo(file, entityName, entityId, this.requester(), this.tenant());

    if (bucket === Buckets.Thumbnails && ensureEntityName(entityName, entityId, thumbnailsEntities))
      return await this.uploadsService.uploadThumbnail(file, entityName, entityId, this.requester(), this.tenant());

    if (bucket === Buckets.Receipts && ensureEntityName(entityName, entityId, receiptsEntities))
      return await this.uploadsService.uploadReceipt(file, entityName, entityId, this.requester(), this.tenant());

    if (bucket === Buckets.Attachments && ensureEntityName(entityName, entityId, attachmentsEntities))
      return await this.uploadsService.uploadAttachment(file, entityName, entityId, this.requester(), this.tenant());

    throw new BadRequestException(`Invalid bucket ${bucket}`);
  }
}
