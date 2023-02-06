import { ContentModel } from './content.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ContentRepository } from '@okampus/api/dal';

import { Content } from '@okampus/api/dal';
import type { ContentMaster, ContentOptions, FileUpload, Individual, Org, TenantCore, Ugc } from '@okampus/api/dal';
import type { IContent } from '@okampus/shared/dtos';

@Injectable()
export class ContentFactory extends BaseFactory<ContentModel, Content, IContent, ContentOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, eventApprovalRepository: ContentRepository) {
    super(ep, eventApprovalRepository, ContentModel, Content);
  }

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
