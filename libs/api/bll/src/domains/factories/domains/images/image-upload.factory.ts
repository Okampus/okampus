import { ImageUploadModel } from './image-upload.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { ImageUpload } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ImageUploadRepository } from '@okampus/api/dal';

import type { TenantCore, ImageUploadOptions, Individual } from '@okampus/api/dal';
import type { IImageUpload } from '@okampus/shared/dtos';

@Injectable()
export class ImageUploadFactory extends BaseFactory<ImageUploadModel, ImageUpload, IImageUpload, ImageUploadOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, imageUploadRepository: ImageUploadRepository) {
    super(ep, imageUploadRepository, ImageUploadModel, ImageUpload);
  }

  modelToEntity(model: Required<ImageUploadModel>): ImageUpload {
    return new ImageUpload({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      uploadedBy: { id: model.uploadedBy.id } as Individual,
    });
  }
}
