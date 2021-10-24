import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from '../users/user.schema';
import { CommentVote } from './schemas/comment-vote.schema';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentVotesService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(CommentVote.name) private readonly commentVotesModel: Model<CommentVote>,
  ) {}

  public async upvote(user: User, commentId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const existed = await this.commentVotesModel.findOneAndUpdate(
      { comment, user: user._id },
      { value: 1 },
      { upsert: true },
    );
    if (existed?.value === 1)
      return comment;
    if (existed?.value === -1)
      comment.downvotes--;
    comment.upvotes++;
    return await comment.save();
  }

  public async downvote(user: User, commentId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const existed = await this.commentVotesModel.findOneAndUpdate(
      { comment, user: user._id },
      { value: -1 },
      { upsert: true },
    );
    if (existed?.value === -1)
      return comment;
    if (existed?.value === 1)
      comment.upvotes--;
    comment.downvotes++;
    return await comment.save();
  }

  public async neutralize(user: User, commentId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment)
      throw new NotFoundException('Comment not found');

    const oldVote = await this.commentVotesModel.findOneAndRemove({ comment, user: user._id });
    if (oldVote?.value === 1) {
      comment.upvotes--;
      await comment.save();
    } else if (oldVote?.value === -1) {
      comment.downvotes--;
      await comment.save();
    }
    return comment;
  }
}
