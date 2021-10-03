import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from '../users/user.schema';
import { PostLikes } from './schemas/post-likes.schema';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PostLikes.name) private readonly postLikesModel: Model<PostLikes>,
  ) {}

  public async like(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const existed = await this.postLikesModel.findOneAndUpdate(
      { post, user: user._id },
      { value: 1 },
      { upsert: true },
    );
    if (existed?.value === 1)
      return post;
    if (existed?.value === -1)
      post.dislikes--;
    post.likes++;
    return await post.save();
  }

  public async dislike(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const existed = await this.postLikesModel.findOneAndUpdate(
      { post, user: user._id },
      { value: -1 },
      { upsert: true },
    );
    if (existed?.value === -1)
      return post;
    if (existed?.value === 1)
      post.likes--;
    post.dislikes++;
    return await post.save();
  }

  public async neutralize(user: User, postId: number): Promise<Post> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');

    const oldLike = await this.postLikesModel.findOneAndRemove({ post, user: user._id });
    if (oldLike?.value === 1) {
      post.likes--;
      await post.save();
    } else if (oldLike?.value === -1) {
      post.dislikes--;
      await post.save();
    }
    return post;
  }
}
