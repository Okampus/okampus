import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from '../users/user.schema';
import { PostVotes } from './schemas/post-votes.schema';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostVotesService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostVotes.name) private readonly postVotesModel: Model<PostVotes>,
  ) {}

  public async upvote(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const existed = await this.postVotesModel.findOneAndUpdate(
      { post, user: user._id },
      { value: 1 },
      { upsert: true },
    );
    if (existed?.value === 1)
      return post;
    if (existed?.value === -1)
      post.downvotes--;
    post.upvotes++;
    return await post.save();
  }

  public async downvote(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const existed = await this.postVotesModel.findOneAndUpdate(
      { post, user: user._id },
      { value: -1 },
      { upsert: true },
    );
    if (existed?.value === -1)
      return post;
    if (existed?.value === 1)
      post.upvotes--;
    post.downvotes++;
    return await post.save();
  }

  public async neutralize(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const oldVote = await this.postVotesModel.findOneAndRemove({ post, user: user._id });
    if (oldVote?.value === 1) {
      post.upvotes--;
      await post.save();
    } else if (oldVote?.value === -1) {
      post.downvotes--;
      await post.save();
    }
    return post;
  }
}
