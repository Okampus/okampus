import { TagModel } from './tag.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Tag } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TagRepository } from '@okampus/api/dal';

import type { TenantCore, TagOptions, ImageUpload } from '@okampus/api/dal';
import type { ITag } from '@okampus/shared/dtos';

@Injectable()
export class TagFactory extends BaseFactory<TagModel, Tag, ITag, TagOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, tagRepository: TagRepository) {
    super(ep, tagRepository, TagModel, Tag);
  }

  modelToEntity(model: Required<TagModel>): Tag {
    return new Tag({
      color: model.color,
      name: model.name,
      slug: model.slug,
      description: model.description,
      iconImage: { id: model.iconImage?.id } as ImageUpload,
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}
