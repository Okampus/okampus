import { SocialModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Individual, SocialRepository } from '@okampus/api/dal';
import { Social, TenantCore, Actor } from '@okampus/api/dal';

import type { SocialOptions } from '@okampus/api/dal';
import type { ISocial } from '@okampus/shared/dtos';

@Injectable()
export class SocialFactory extends BaseFactory<SocialModel, Social, ISocial, SocialOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    socialRepository: SocialRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, socialRepository, SocialModel, Social);
  }

  modelToEntity(model: Required<SocialModel>): Social {
    return new Social({
      ...model,
      actor: this.em.getReference(Actor, model.actor.id),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
