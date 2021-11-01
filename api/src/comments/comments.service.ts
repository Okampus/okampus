import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/schemas/post.schema';
import type { User } from '../users/user.schema';
import type { CreateCommentDto } from './dto/create-comment.dto';
import type { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  public async create(user: User, postId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postModel.findById(postId);
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.locked)
      throw new ForbiddenException('Post locked');

    const comment = await this.commentModel.create({
      body: createCommentDto.body,
      post,
      author: user,
    });
    return comment;
  }

  public async findAll(postId: number): Promise<Comment[]> {
    return await this.commentModel.find({ post: postId });
  }

  public async findOne(id: string): Promise<Comment | null> {
    const comment = await this.commentModel.findById(id);
    if (!comment)
      throw new NotFoundException('Comment not found');
    return comment;
  }

  public async update(user: User, id: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentModel.findById(id).populate<{ post: Post }>('post');
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.post.locked)
      throw new ForbiddenException('Post locked');
    if (!comment.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    Object.assign(comment, updateCommentDto);
    return await comment.save();
  }

  public async remove(user: User, id: string): Promise<void> {
    const comment = await this.commentModel.findById(id).populate<{ post: Post }>('post');
    if (!comment)
      throw new NotFoundException('Comment not found');
    if (comment.post.locked)
      throw new ForbiddenException('Post locked');
    if (!comment.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    await comment.remove();
  }
}
