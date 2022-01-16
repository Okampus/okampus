import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import type { RegisterDto } from '../auth/dto/register.dto';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchService } from './user-search.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly userSearchService: UserSearchService,
  ) {}

  public async findOne(username: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ username: { $ilike: username } });
  }

  public async findOneById(userId: string): Promise<User> {
    return await this.userRepository.findOneOrFail({ userId });
  }

  public async validateUsernameAndEmail(username: string, email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      $or: [
        { username: { $ilike: username } },
        { email: email.toLowerCase() },
      ],
    });
    return Boolean(user);
  }

  public async create(body: RegisterDto): Promise<User> {
    const user = new User(body.username, body.email.toLowerCase());
    await user.setPassword(body.password);
    await this.userRepository.persistAndFlush(user);
    await this.userSearchService.add(user);
    return user;
  }

  public async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ userId }, { populate: ['badges'] });

    wrap(user).assign(updateUserDto);
    await this.userRepository.flush();

    return user;
  }
}
