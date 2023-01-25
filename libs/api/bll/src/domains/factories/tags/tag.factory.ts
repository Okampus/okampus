import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TenantCore, Tag, TagRepository, TagOptions } from '@okampus/api/dal';
import { ITag } from '@okampus/shared/dtos';
import { loadTag } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { TagModel } from './tag.model';

@Injectable()
export class TagFactory extends BaseFactory<TagModel, Tag, ITag, TagOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, tagRepository: TagRepository) {
    super(ep, tagRepository, TagModel, Tag);
  }

  entityToModel(entity: Tag): TagModel | undefined {
    const tag = loadTag(entity);
    if (!tag) return undefined;
    return this.createModel(tag);
  }

  modelToEntity(model: Required<TagModel>): Tag {
    return new Tag({
      color: model.color,
      name: model.name,
      description: model.description,
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}
