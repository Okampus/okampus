import { TagModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Individual, TagRepository } from '@okampus/api/dal';
import { ImageUpload, Tag, TenantCore } from '@okampus/api/dal';

import type { TagOptions } from '@okampus/api/dal';
import type { ITag } from '@okampus/shared/dtos';

@Injectable()
export class TagFactory extends BaseFactory<TagModel, Tag, ITag, TagOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    tagRepository: TagRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, tagRepository, TagModel, Tag);
  }

  modelToEntity(model: Required<TagModel>): Tag {
    return new Tag({
      color: model.color,
      name: model.name,
      slug: model.slug,
      description: model.description,
      iconImage: model.iconImage ? this.em.getReference(ImageUpload, model.iconImage.id) : null,
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
