import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { User } from '../users/user.entity';
import { ReplyVote } from './entities/reply-vote.entity';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReplyVotesService {
  constructor(
    @InjectRepository(Reply) private readonly replyRepository: BaseRepository<Reply>,
    @InjectRepository(ReplyVote) private readonly replyVotesRepository: BaseRepository<ReplyVote>,
  ) {}

  public async update(user: User, replyId: string, value: -1 | 1): Promise<Reply> {
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (reply.post.locked)
      throw new ForbiddenException('Post locked');

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
    const reply = await this.replyRepository.findOne({ replyId });
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (reply.post.locked)
      throw new ForbiddenException('Post locked');

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
