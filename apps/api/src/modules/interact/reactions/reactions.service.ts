import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Action } from '@common/modules/authorization';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@create/contents/entities/content.entity';
import { BaseRepository } from '@lib/orm/base.repository';
import type { AllReaction } from '@lib/types/enums/reaction.enum';
import { assertPermissions } from '@lib/utils/assert-permission';
import type { User } from '@uaa/users/user.entity';
import { Reaction } from './reaction.entity';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async add(user: User, id: number, value: AllReaction): Promise<Reaction> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    const entity = await this.reactionRepository.findOne({ content, user, value });
    if (entity)
      throw new BadRequestException('Reaction already added on content');

    const newReaction = new Reaction({ content, user, value });

    await this.reactionRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async findAll(user: User, id: number): Promise<Reaction[]> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Read, content);

    return await this.reactionRepository.find({ content }, { populate: ['user', 'content'] });
  }

  public async remove(user: User, id: number, value: AllReaction): Promise<void> {
    const content = await this.contentRepository.findOneOrFail({ id });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    const entity = await this.reactionRepository.findOneOrFail({ content, user, value });
    await this.reactionRepository.removeAndFlush(entity);
  }
}
