import {
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserInterceptor } from '../shared/interceptors/user.interceptor';
import type { User } from './user.schema';
import { UserService } from './users.service';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(UserInterceptor)
  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return await this.userService.validateUserByName(username);
  }
}
