import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import type { RegisterDto } from '../auth/dto/register.dto';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async getUserByName(name: string): Promise<User | null> {
    return await this.userRepository.findOne({ username: { $ilike: name } });
  }

  public async validateUserByName(username: string): Promise<User> {
    const user = await this.getUserByName(username);
    if (!user)
      throw new NotFoundException('User not found');

    return user;
  }

  public async getUserByEmail(mail: string): Promise<User | null> {
    return await this.userRepository.findOne({ email: mail.toLowerCase() });
  }

  public async getUserById(userId: string): Promise<User | null> {
    return await this.userRepository.findOne({ userId });
  }

  public async validateUserById(userId: string): Promise<User> {
    const user = await this.getUserById(userId);
    if (!user)
      throw new NotFoundException('User not found');

    return user;
  }

  public async getUser(login: string): Promise<User | null> {
    return (await this.getUserByName(login)) ?? (await this.getUserByEmail(login));
  }

  public async create(body: RegisterDto): Promise<User> {
    const user = new User(body.username, body.email.toLowerCase());
    await user.setPassword(body.password);
    await this.userRepository.persistAndFlush(user);
    return user;
  }
}
