import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import type { User } from '../users/user.entity';
import type { NoReplyVote } from './entities/reply-vote.entity';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReplyVotesService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(ReplyVote) private readonly replyVotesRepository: BaseRepository<ReplyVote>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async findVote(user: User, replyId: string): Promise<NoReplyVote | ReplyVote> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    // TODO: Maybe the user won't have access to this reply. There can be some restrictions
    // (i.e. "personal"/"sensitive" replys)

    return await this.replyVotesRepository.findOne({ reply, user }) ?? { reply, user, value: 0 };
  }

  public async update(user: User, replyId: string, value: -1 | 1): Promise<Reply> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, reply);

    let vote = await this.replyVotesRepository.findOne({ reply, user });
    const previousValue = vote?.value;
    if (previousValue === value)
      return reply;

    // Update pivot table
    if (vote)
      vote.value = value;
    else
      vote = new ReplyVote(reply, user, value);
    await this.replyVotesRepository.persistAndFlush(vote);

    // Update reply
    if (value === 1)
      reply.upvotes++;
    else if (value === -1)
      reply.downvotes++;

    if (value === 1 && previousValue === -1)
      reply.downvotes--;
    else if (value === -1 && previousValue === 1)
      reply.upvotes--;

    await this.replyRepository.flush();
    return reply;
  }

  public async neutralize(user: User, replyId: string): Promise<Reply> {
    const reply = await this.replyRepository.findOneOrFail({ replyId }, ['author', 'post']);

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Interact, reply);

    // Update pivot table
    const oldVote = await this.replyVotesRepository.findOne({ reply, user });
    if (!oldVote)
      return reply;
    await this.replyVotesRepository.removeAndFlush(oldVote);

    // Update reply
    if (oldVote?.value === 1)
      reply.upvotes--;
    else if (oldVote?.value === -1)
      reply.downvotes--;

    await this.replyRepository.flush();
    return reply;
  }
}
