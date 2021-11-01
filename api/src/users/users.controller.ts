import {
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserInterceptor } from '../shared/interceptors/user.interceptor';
import type { User } from './user.schema';
import { UsersService } from './users.service';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(UserInterceptor)
  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.validateUserByName(username);
  }
}
