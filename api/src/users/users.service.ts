import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getUserByName(name: string): Promise<User | null> {
    return await this.userModel.findOne({ username: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  public async validateUserByName(username: string): Promise<User> {
    const user = await this.getUserByName(username);
    if (!user)
      throw new NotFoundException('User not found');

    return user;
  }

  public async getUserByEmail(mail: string): Promise<User | null> {
    return await this.userModel.findOne({ email: mail.toLowerCase() });
  }

  public async getUserById(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  public async validateUserById(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user)
      throw new NotFoundException('User not found');

    return user;
  }

  public async getUser(username: string): Promise<User | null> {
    return (await this.getUserByName(username)) ?? (await this.getUserByEmail(username));
  }

  public async create(body: Partial<User>): Promise<User> {
    const user = await this.userModel.create({
      ...body,
      email: body.email!.toLowerCase(),
    });
    return await user.save();
  }
}
