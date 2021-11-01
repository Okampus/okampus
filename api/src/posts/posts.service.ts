import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import type { CustomPaginateResult } from '../shared/pagination';
import { labelize } from '../shared/pagination';
import type { User } from '../users/user.schema';
import type { CreatePostDto } from './dto/create-post.dto';
import type { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './schemas/post.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PaginateModel<Post>,
  ) {}

  public async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
    const post = await this.postModel.create({ ...createPostDto, author: user });
    return post;
  }

  public async findAll(
    paginationOptions?: { page: number; itemsPerPage: number },
  ): Promise<CustomPaginateResult<Post> | Post[]> {
    if (paginationOptions) {
      return labelize(await this.postModel.paginate({}, {
        page: paginationOptions.page,
        limit: paginationOptions.itemsPerPage,
        populate: {
          path: 'author',
          select: 'username avatar reputation',
        },
      }));
    }
    return await this.postModel.find().populate({ path: 'items', populate: { path: 'author' } });
  }

  public async findOne(id: number): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post)
      throw new NotFoundException('Post not found');
    return post.populate('author');
  }

  public async update(user: User, id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postModel.findById(id);
    if (!post)
      throw new NotFoundException('Post not found');
    if (post.locked) {
      // Even if the post is locked, we can still unlock it.
      if (updatePostDto?.locked === false)
        updatePostDto = { locked: false };
      else
        throw new ForbiddenException('Post locked');
    }
    if (!post.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    Object.assign(post, updatePostDto);
    return await post.save();
  }

  public async remove(user: User, id: number): Promise<void> {
    const post = await this.postModel.findById(id);
    if (!post)
      throw new NotFoundException('Post not found');
    if (!post.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    await post.remove();
  }
}
