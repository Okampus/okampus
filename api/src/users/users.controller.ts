import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOne(username);
  }
}
