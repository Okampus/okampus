import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Content } from '../contents/content.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import { Reaction } from './reaction.entity';
import type { AllReactionValue } from './reaction.enum';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findAll(contentId: number): Promise<Reaction[]> {
    // TODO: Maybe the user won't have access to this post. There can be some restrictions
    // (i.e. "personal"/"sensitive" posts)
    const content = await this.contentRepository.findOneOrFail({ contentId });
    return await this.reactionRepository.find({ content }, { populate: ['user', 'content'] });
  }

  public async add(user: User, contentId: number, value: AllReactionValue): Promise<Reaction> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    const entity = await this.reactionRepository.findOne({ content, user, value });
    if (entity)
      throw new BadRequestException('Reaction already added on content');

    const newReaction = new Reaction({ content, user, value });

    await this.reactionRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async remove(user: User, contentId: number, value: AllReactionValue): Promise<void> {
    const content = await this.contentRepository.findOneOrFail({ contentId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, content);

    const entity = await this.reactionRepository.findOneOrFail({ content, user, value });
    await this.reactionRepository.removeAndFlush(entity);
  }
}
