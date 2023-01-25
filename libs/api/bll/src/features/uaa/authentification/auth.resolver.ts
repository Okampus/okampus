import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { TenantPublic } from '@okampus/api/shards';
import { User } from '@okampus/api/dal';
import { UsersService } from '../../../domains/resources/users/users.service';
import { Requester } from '../../../shards/global-request/current-user.decorator';
import { UserModel } from '../../../domains/factories/users/user.model';
import { AuthService } from './auth.service';

interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
}

@Resolver(() => UserModel)
export class AuthResolver {
  constructor(private readonly usersService: UsersService, private readonly authService: AuthService) {}

  // TODO: Add permission checks
  @TenantPublic()
  @Mutation(() => UserModel)
  public async login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() ctx: GraphQLContext
  ): Promise<UserModel> {
    const user = await this.authService.login({ username, password }, ctx.req, ctx.reply);
    console.log('user', user);
    return user;
  }

  @Mutation(() => Boolean)
  public async wsToken(@Requester() user: User, @Context() ctx: GraphQLContext): Promise<boolean> {
    this.authService.addWebSocketTokenIfAuthenticated(ctx.reply, user.id);
    return true;
  }

  @Query(() => UserModel)
  public async me(@Requester() user: User): Promise<UserModel> {
    return await this.usersService.findOneById(user.id);
  }
}
