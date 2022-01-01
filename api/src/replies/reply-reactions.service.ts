import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { ReplyReaction as ReplyReactionEnum } from '../shared/modules/reaction/reaction.enum';
import type { User } from '../users/user.entity';
import { ReplyReaction } from './entities/reply-reaction.entity';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReplyReactionsService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(ReplyReaction) private readonly replyReactionsRepository: BaseRepository<ReplyReaction>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findAll(replyId: string): Promise<ReplyReaction[]> {
    // TODO: Maybe the user won't have access to this reply. There can be some restrictions
    // (i.e. "personal"/"sensitive" replys)
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');

    return await this.replyReactionsRepository.find({ reply }, ['user', 'reply']);
  }

  public async add(user: User, replyId: string, reaction: ReplyReactionEnum): Promise<ReplyReaction> {
    const reply = await this.replyRepository.findOne({ replyId }, ['post']);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, reply);

    const entity = await this.replyReactionsRepository.findOne({ reply, user, value: reaction });
    if (entity)
      return entity;

    const newReaction = new ReplyReaction(reply, user, reaction);
    await this.replyReactionsRepository.persistAndFlush(newReaction);
    return newReaction;
  }

  public async remove(user: User, replyId: string, reaction: ReplyReactionEnum): Promise<void> {
    const reply = await this.replyRepository.findOne({ replyId }, ['post']);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, reply);

    const reactionEntity = await this.replyReactionsRepository.findOne({ reply, user, value: reaction });
    if (!reactionEntity)
      throw new NotFoundException('Reaction not found');

    await this.replyReactionsRepository.removeAndFlush(reactionEntity);
  }
}
