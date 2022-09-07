import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { AdminTeamSocialUpdatedNotification } from '../shared/modules/notifications/notifications';
import { NotificationsService } from '../shared/modules/notifications/notifications.service';
import type { User } from '../users/user.entity';
import type { CreateSocialDto } from './dto/create-social.dto';
import type { UpdateSocialDto } from './dto/update-social.dto';
import { Social } from './social.entity';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async createSocial(
    user: User,
    createSocialDto: CreateSocialDto,
  ): Promise<Social> {
    const social = new Social({ ...createSocialDto, user });
    await this.socialsRepository.persistAndFlush(social);
    return social;
  }

  public async findAllUserSocials(id: string): Promise<Social[]> {
    return await this.socialsRepository.find({ user: { id } }, { populate: ['user'] });
  }

  public async findAllTeamSocials(id: number): Promise<Social[]> {
    return await this.socialsRepository.find({ team: { id } }, { populate: ['team'] });
  }

  public async updateSocial(
    user: User,
    id: number,
    updateSocialDto: UpdateSocialDto,
  ): Promise<Social> {
    const social = await this.socialsRepository.findOneOrFail(
      { id },
      { populate: ['user', 'team'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    if (social.user) {
      assertPermissions(ability, Action.Update, social.user);

      wrap(social).assign(updateSocialDto);
      await this.socialsRepository.flush();
    } else if (social.team) {
      assertPermissions(ability, Action.Update, social.team);
      const previous = { previousLink: social.link, previousPseudo: social.pseudo };

      wrap(social).assign(updateSocialDto);
      await this.socialsRepository.flush();

      void this.notificationsService.trigger(
        new AdminTeamSocialUpdatedNotification(social, { ...previous, executor: user }),
      );
    }
    return social;
  }

  public async deleteSocial(user: User, id: number): Promise<void> {
    const social = await this.socialsRepository.findOneOrFail(
      { id },
      { populate: ['user', 'team'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    if (social.user) {
      assertPermissions(ability, Action.Update, social.user);
    } else if (social.team) {
      assertPermissions(ability, Action.Update, social.team);
      const previous = { previousLink: social.link, previousPseudo: social.pseudo };

      void this.notificationsService.trigger(
        new AdminTeamSocialUpdatedNotification(social, { ...previous, executor: user }),
      );
    }

    await this.socialsRepository.removeAndFlush(social);
  }
}
