import { ImageUploadModel } from './image-upload.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ImageUploadRepository } from '@okampus/api/dal';
import { ImageUpload, Individual, TenantCore } from '@okampus/api/dal';

import type { ImageUploadOptions } from '@okampus/api/dal';
import type { IImageUpload } from '@okampus/shared/dtos';

@Injectable()
export class ImageUploadFactory extends BaseFactory<ImageUploadModel, ImageUpload, IImageUpload, ImageUploadOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    imageUploadRepository: ImageUploadRepository,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, imageUploadRepository, ImageUploadModel, ImageUpload);
  }

  modelToEntity(model: Required<ImageUploadModel>): ImageUpload {
    return new ImageUpload({
      ...model,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
      uploadedBy: this.em.getReference(Individual, model.uploadedBy.id),
    });
  }
}
