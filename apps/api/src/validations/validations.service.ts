import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../create/contents/entities/content.entity';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { ValidationType } from '../shared/lib/types/enums/validation-type.enum';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { ThreadSubscribedAnsweredNotification } from '../shared/modules/notifications/notifications';
import { NotificationsService } from '../shared/modules/notifications/notifications.service';
import type { User } from '../uua/users/user.entity';
import { Validation } from './validation.entity';

@Injectable()
export class ValidationsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Validation) private readonly validationRepository: BaseRepository<Validation>,
    private readonly notificationsService: NotificationsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(id: number, user: User, type: ValidationType): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ id }, { populate: ['author', 'contentMaster'] });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    if (type === ValidationType.Op && content.author.id !== user.id)
      throw new BadRequestException('User is not original poster');
    else if (type === ValidationType.Admin && !this.caslAbilityFactory.isModOrAdmin(user))
      throw new BadRequestException('User is not admin');

    const validation = new Validation({ content, user, type });
    await this.validationRepository.persistAndFlush(validation);

    void this.notificationsService.trigger(new ThreadSubscribedAnsweredNotification(content, { executor: user }));

    return validation;
  }

  public async findOne(user: User, id: number): Promise<Validation> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return this.validationRepository.findOneOrFail({ content, user });
  }

  public async remove(id: number, user: User): Promise<void> {
    const validation = await this.validationRepository.findOneOrFail({ content: { id }, user });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, validation.content);

    await this.validationRepository.removeAndFlush(validation);
  }
}
