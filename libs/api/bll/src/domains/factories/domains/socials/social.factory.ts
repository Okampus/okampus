import { SocialModel } from './social.model';
import { BaseFactory } from '../../base.factory';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { Social } from '@okampus/api/dal';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SocialRepository } from '@okampus/api/dal';

import type { TenantCore, Actor, SocialOptions } from '@okampus/api/dal';
import type { ISocial } from '@okampus/shared/dtos';

@Injectable()
export class SocialFactory extends BaseFactory<SocialModel, Social, ISocial, SocialOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, socialRepository: SocialRepository) {
    super(ep, socialRepository, SocialModel, Social);
  }

  modelToEntity(model: Required<SocialModel>): Social {
    return new Social({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      actor: { id: model.actor.id } as Actor,
    });
  }
}
