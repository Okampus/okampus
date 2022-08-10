import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import type { Response } from 'express';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
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

  @Mutation(() => User)
  public async wsToken(@CurrentUser() user: User, @Context() ctx: GraphQLResponse): Promise<User> {
    await this.authController.wsToken(user, ctx.req.res);
    return user;
  }

  @Query(() => User)
  public async me(@CurrentUser() user: User): Promise<User> {
    return await this.usersService.findOneById(user.id);
  }
}
