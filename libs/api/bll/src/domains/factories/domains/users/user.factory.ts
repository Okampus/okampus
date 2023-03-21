// eslint-disable-next-line import/no-cycle
import { UserModel } from '../../index';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';
import { addImagesToActor, separateActorProps } from '../../factory.utils';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager, Populate } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserRepository } from '@okampus/api/dal';
import { Shortcut, TenantCore, User, Tag } from '@okampus/api/dal';
import { ActorKind } from '@okampus/shared/enums';
import { fullName } from '@okampus/shared/utils';

import type { ActorImageUploadProps, UserOptions } from '@okampus/api/dal';
import type { IActorImage, IUser, UpdateUserDto } from '@okampus/shared/dtos';

@Injectable()
export class UserFactory extends BaseFactory<UserModel, User, IUser, UserOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    userRepository: UserRepository,
    uploadService: UploadService,
    private readonly em: EntityManager
  ) {
    super(eventPublisher, uploadService, userRepository, UserModel, User);
  }

  async createUser(options: Omit<UserOptions, 'createdBy'>, images?: ActorImageUploadProps): Promise<UserModel> {
    const createdBy = this.requester();
    return await this.create({ ...options, createdBy }, async (user) => {
      if (images) {
        const kind = ActorKind.Individual;
        user.actor = await addImagesToActor(user.actor, kind, images, createdBy, options.tenant, this.uploadService);
      }
      return user;
    });
  }

  async updateUser(
    updateUser: UpdateUserDto,
    tenant: TenantCore,
    populate: Populate<User>,
    actorImages?: ActorImageUploadProps
  ) {
    const { id, ...data } = updateUser;

    const transform = async (user: User) => {
      user.actor.name = fullName(data.firstName ?? user.firstName, data.lastName ?? user.lastName);
      if (actorImages) {
        const actorKind = user.actor.actorKind();
        await addImagesToActor(user.actor, actorKind, actorImages, this.requester(), tenant, this.uploadService);
      }
      return user;
    };

    const transformModel = async (model: UserModel) => {
      if (actorImages && model.actor && model.actor.actorImages)
        model.actor.actorImages = model.actor.actorImages.filter((image: IActorImage) => !image.lastActiveDate);
      return model;
    };

    return await this.update({ id, tenant }, populate, separateActorProps(data), false, transform, transformModel);
  }

  modelToEntity(model: Required<UserModel>): User {
    const user = new User({
      ...model,
      ...model.actor,
      shortcuts: model.shortcuts.map((shortcut) => this.em.getReference(Shortcut, shortcut.id)),
      tags: model.actor.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      createdBy: model.createdBy ? this.em.getReference(User, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });

    return user;
  }
}
