import {
  Args,
  Context,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import type { Response } from 'express';
import { Public } from '../shared/lib/decorators/public.decorator';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';

interface GraphQLResponse {
  req: {
    res: Response;
  };
}

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authController: AuthController,
  ) {}

  // TODO: Add permission checks
  @Public()
  @Mutation(() => User)
  public async login(@Args('username') username: string, @Args('password') password: string, @Context() ctx: GraphQLResponse): Promise<User> {
    return await this.authController.login({ username, password }, ctx.req.res);
  }
}
