import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  ActorImageUploadProps,
  Tag,
  TenantCore,
  User,
  UserOptions,
  UserProfile,
  UserRepository,
} from '@okampus/api/dal';
import { IUser } from '@okampus/shared/dtos';
import { ActorKind } from '@okampus/shared/enums';
import { loadUser } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { UserModel } from './user.model';
import { addImagesToActor } from '../abstract.utils';
import { UploadService } from '../../../features/uploads/upload.service';

@Injectable()
export class UserFactory extends BaseFactory<UserModel, User, IUser, UserOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly uploadService: UploadService,
    userRepository: UserRepository
  ) {
    super(ep, userRepository, UserModel, User);
  }

  async createUserWithImages(options: UserOptions, images?: ActorImageUploadProps): Promise<UserModel> {
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

  entityToModel(entity: User): UserModel | undefined {
    const user = loadUser(entity);
    if (!user) return undefined;
    return this.createModel(user);
  }

  modelToEntity(model: Required<UserModel>): User {
    const user = new User({
      firstName: model.firstName,
      lastName: model.lastName,
      middleNames: model.middleNames,
      scopeRole: model.scopeRole,
      bio: model.actor.bio,
      name: model.actor.name,
      primaryEmail: model.actor.primaryEmail,
      slug: model.actor.slug,
      roles: model.roles,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
      tenant: { id: model.tenant.id } as TenantCore,
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
