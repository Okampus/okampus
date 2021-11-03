import { Controller, Get, Param } from '@nestjs/common';
import type { User } from './user.entity';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.validateUserByName(username);
  }
}
