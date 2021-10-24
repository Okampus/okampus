import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { User } from '../users/user.schema';
import type { CreateReplyDto } from './dto/create-reply.dto';
import type { UpdateReplyDto } from './dto/update-reply.dto';
import { Reply } from './schemas/reply.schema';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
  ) {}

  public async create(user: User, commentId: string, createReplyDto: CreateReplyDto): Promise<Reply> {
    const reply = await this.replyModel.create({
      body: createReplyDto.body,
      commentId,
      author: user,
    });
    return reply;
  }

  public async findAll(commentId: string): Promise<Reply[]> {
    return await this.replyModel.find({ commentId });
  }

  public async findOne(id: string): Promise<Reply | null> {
    const reply = await this.replyModel.findById(id);
    if (!reply)
      throw new NotFoundException('Reply not found');
    return reply;
  }

  public async update(user: User, id: string, updateReplyDto: UpdateReplyDto): Promise<Reply> {
    const reply = await this.replyModel.findById(id);
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (!reply.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    Object.assign(reply, updateReplyDto);
    return await reply.save();
  }

  public async remove(user: User, id: string): Promise<void> {
    const reply = await this.replyModel.findById(id);
    if (!reply)
      throw new NotFoundException('Reply not found');
    if (!reply.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    await reply.remove();
  }
}
