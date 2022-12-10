import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import type { FastifyReply } from 'fastify';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { Public } from '@lib/decorators/public.decorator';
import { User } from '@uaa/users/user.entity';
import { UsersService } from '@uaa/users/users.service';
import { AuthController } from './auth.controller';

interface GraphQLResponse {
  reply: FastifyReply;
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
    return await this.authController.login({ username, password }, ctx.reply);
  }

  @Mutation(() => User)
  public async wsToken(@CurrentUser() user: User, @Context() ctx: GraphQLResponse): Promise<User> {
    await this.authController.wsToken(user, ctx.reply);
    return user;
  }

  @Query(() => User)
  public async me(@CurrentUser() user: User): Promise<User> {
    return await this.usersService.findOne(user.id);
  }
}
