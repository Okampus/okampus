import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TenantCore, ImageUpload, ImageUploadRepository, ImageUploadOptions, Individual } from '@okampus/api/dal';
import { IImageUpload } from '@okampus/shared/dtos';
import { loadImageUpload } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { ImageUploadModel } from './image-upload.model';

@Injectable()
export class ImageUploadFactory extends BaseFactory<ImageUploadModel, ImageUpload, IImageUpload, ImageUploadOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, imageUploadRepository: ImageUploadRepository) {
    super(ep, imageUploadRepository, ImageUploadModel, ImageUpload);
  }

  entityToModel(entity: ImageUpload): ImageUploadModel | undefined {
    const imageUpload = loadImageUpload(entity);
    if (!imageUpload) return undefined;
    return this.createModel(imageUpload);
  }

  modelToEntity(model: Required<ImageUploadModel>): ImageUpload {
    return new ImageUpload({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      uploadedBy: { id: model.uploadedBy.id } as Individual,
    });
  }
}
