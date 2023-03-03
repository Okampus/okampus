import { UserModel } from './user.model';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';
import { addImagesToActor } from '../../abstract.utils';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserRepository } from '@okampus/api/dal';
import { TenantCore, User, UserProfile, Tag } from '@okampus/api/dal';
import { ActorKind } from '@okampus/shared/enums';

import type { ActorImageUploadProps, UserOptions } from '@okampus/api/dal';
import type { IUser } from '@okampus/shared/dtos';

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

  async createUser(options: UserOptions, images?: ActorImageUploadProps): Promise<UserModel> {
    return await this.create(options, async (user) => {
      if (images)
        user.actor = await addImagesToActor(
          user.actor,
          ActorKind.Individual,
          images,
          options.tenant,
          this.uploadService
        );
      return user;
    });
  }

  modelToEntity(model: Required<UserModel>): User {
    const user = new User({
      bio: model.actor.bio,
      firstName: model.firstName,
      lastName: model.lastName,
      middleNames: model.middleNames,
      name: model.actor.name,
      primaryEmail: model.actor.primaryEmail,
      roles: model.roles,
      scopeRole: model.scopeRole,
      slug: model.actor.slug,
      tags: model.actor.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });

    user.profile = new UserProfile({
      user,
      customization: model.profile.customization,
      stats: model.profile.stats,
      settings: model.profile.settings,
      notificationSettings: model.profile.notificationSettings,
      finishedIntroduction: model.profile.finishedIntroduction,
      finishedOnboarding: model.profile.finishedOnboarding,
    });

    return user;
  }
}
