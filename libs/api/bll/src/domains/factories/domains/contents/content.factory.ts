import { ContentModel } from './content.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ContentRepository, ContentMaster, FileUpload, Individual, Org, TenantCore, Ugc } from '@okampus/api/dal';

import { Content } from '@okampus/api/dal';
import type { ContentOptions } from '@okampus/api/dal';
import type { IContent } from '@okampus/shared/dtos';

@Injectable()
export class ContentFactory extends BaseFactory<ContentModel, Content, IContent, ContentOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    contentRepository: ContentRepository,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, contentRepository, ContentModel, Content);
  }

  modelToEntity(model: Required<ContentModel>): Content {
    return new Content({
      ...model,
      attachments: model.attachments.map((file) => this.em.getReference(FileUpload, file.id)),
      realAuthor: this.em.getReference(Individual, model.author.id),
      representingOrg: model.representingOrg ? this.em.getReference(Org, model.representingOrg.id) : null,
      contentMaster: model.contentMaster ? this.em.getReference(ContentMaster, model.contentMaster.id) : null,
      parent: model.parent ? this.em.getReference(Ugc, model.parent.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
