import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import type { TenantCore, TagRepository, TagOptions, ImageUpload } from '@okampus/api/dal';
import { Tag } from '@okampus/api/dal';
import type { ITag } from '@okampus/shared/dtos';
// import { loadTag } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { TagModel } from './tag.model';

@Injectable()
export class TagFactory extends BaseFactory<TagModel, Tag, ITag, TagOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, tagRepository: TagRepository) {
    super(ep, tagRepository, TagModel, Tag);
  }

  // entityToModel(entity: Tag): TagModel | undefined {
  //   const tag = loadTag(entity);
  //   if (!tag) return undefined;
  //   return this.createModel(tag);
  // }

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
