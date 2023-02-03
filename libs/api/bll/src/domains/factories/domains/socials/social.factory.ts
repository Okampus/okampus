import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TenantCore, Actor, Social, SocialRepository, SocialOptions } from '@okampus/api/dal';
import { ISocial } from '@okampus/shared/dtos';
// import { loadSocial } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { SocialModel } from './social.model';

@Injectable()
export class SocialFactory extends BaseFactory<SocialModel, Social, ISocial, SocialOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, socialRepository: SocialRepository) {
    super(ep, socialRepository, SocialModel, Social);
  }

  // entityToModel(entity: Social): SocialModel | undefined {
  //   const event = loadSocial(entity);
  //   if (!event) return undefined;
  //   return this.createModel(event);
  // }

  modelToEntity(model: Required<SocialModel>): Social {
    return new Social({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      actor: { id: model.actor.id } as Actor,
    });
  }
}
