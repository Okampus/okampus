import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import type {
  ContentMaster,
  ContentOptions,
  ContentRepository,
  FileUpload,
  Individual,
  Org,
  TenantCore,
  Ugc} from '@okampus/api/dal';
import {
  Content
} from '@okampus/api/dal';
import type { IContent } from '@okampus/shared/dtos';
// import { loadContent } from '../loader.utils';
// eslint-disable-next-line import/no-cycle
import { BaseFactory } from '../../base.factory';
import { ContentModel } from './content.model';

@Injectable()
export class ContentFactory extends BaseFactory<ContentModel, Content, IContent, ContentOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, eventApprovalRepository: ContentRepository) {
    super(ep, eventApprovalRepository, ContentModel, Content);
  }

  // entityToModel(entity: Content): ContentModel | undefined {
  //   const content = loadContent(entity);
  //   if (!content) return undefined;
  //   return this.createModel(content);
  // }

  modelToEntity(model: Required<ContentModel>): Content {
    return new Content({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      attachments: model.attachments.map((file) => ({ id: file.id } as FileUpload)),
      realAuthor: { id: model.author.id } as Individual,
      representingOrg: model.representingOrg ? ({ id: model.representingOrg.id } as Org) : null,
      contentMaster: model.contentMaster ? ({ id: model.contentMaster.id } as ContentMaster) : null,
      parent: model.parent ? ({ id: model.parent.id } as Ugc) : null,
    });
  }
}
