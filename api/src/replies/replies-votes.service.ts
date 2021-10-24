import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from '../users/user.schema';
import { ReplyVote } from './schemas/reply-vote.schema';
import { Reply } from './schemas/reply.schema';

@Injectable()
export class ReplyVotesService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
    @InjectModel(ReplyVote.name) private readonly replyVotesModel: Model<ReplyVote>,
  ) {}

  public async upvote(user: User, replyId: string): Promise<Reply> {
    const reply = await this.replyModel.findById(replyId);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const existed = await this.replyVotesModel.findOneAndUpdate(
      { reply, user: user._id },
      { value: 1 },
      { upsert: true },
    );
    if (existed?.value === 1)
      return reply;
    if (existed?.value === -1)
      reply.downvotes--;
    reply.upvotes++;
    return await reply.save();
  }

  public async downvote(user: User, replyId: string): Promise<Reply> {
    const reply = await this.replyModel.findById(replyId);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const existed = await this.replyVotesModel.findOneAndUpdate(
      { reply, user: user._id },
      { value: -1 },
      { upsert: true },
    );
    if (existed?.value === -1)
      return reply;
    if (existed?.value === 1)
      reply.upvotes--;
    reply.downvotes++;
    return await reply.save();
  }

  public async neutralize(user: User, replyId: string): Promise<Reply> {
    const reply = await this.replyModel.findById(replyId);
    if (!reply)
      throw new NotFoundException('Reply not found');

    const oldVote = await this.replyVotesModel.findOneAndRemove({ reply, user: user._id });
    if (oldVote?.value === 1) {
      reply.upvotes--;
      await reply.save();
    } else if (oldVote?.value === -1) {
      reply.downvotes--;
      await reply.save();
    }
    return reply;
  }
}
