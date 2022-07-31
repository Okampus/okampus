import { join } from 'node:path';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type { GqlModuleAsyncOptions } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthenticationError, SyntaxError } from 'apollo-server-express';
import { JSONObjectResolver } from 'graphql-scalars';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import type { Token } from '../../auth/jwt-auth.guard';
import type { User } from '../../users/user.entity';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { computedConfig, config } from './config';

export interface GqlWebsocketContext {
  context: {
    user: User;
    headers: object;
  };
}

export default {
  imports: [JwtModule, UsersModule, AuthModule],
  inject: [JwtService, UsersService, AuthService],
  driver: ApolloDriver,
  useFactory: (jwtService: JwtService, usersService: UsersService, authService: AuthService) => ({
    bodyParserConfig: false,
    autoSchemaFile: join(process.cwd(), 'src', 'shared', 'lib', 'schema.gql'),
    sortSchema: true,
    debug: config.get('nodeEnv') === 'development',
    playground: config.get('nodeEnv') === 'development',
    cors: {
      origin: computedConfig.frontendUrl,
      credentials: true,
    },
    resolvers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      JSONObject: JSONObjectResolver,
    },
    installSubscriptionHandlers: true,
    subscriptions: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'subscriptions-transport-ws': {
        onConnect: async (connectionParams: object): Promise<GqlWebsocketContext> => {
          const connectionParamsLowerKeys = Object.fromEntries(
            Object.entries(connectionParams).map(([k, v]) => [k.toLowerCase(), v]),
          );

          const wsToken: string = ('authorization' in connectionParamsLowerKeys)
            && connectionParamsLowerKeys.authorization.split(' ')[1];

          if (!wsToken)
            throw new AuthenticationError('Token not provided');

          const decoded = jwtService.decode(wsToken) as Token;
          if (!decoded)
            throw new SyntaxError('Failed to decode JWT');

          if (decoded.aud !== 'ws')
            throw new AuthenticationError('Invalid token');

          try {
            await jwtService.verifyAsync<Token>(wsToken, authService.getTokenOptions('ws'));
          } catch {
            throw new AuthenticationError('Falsified token');
          }

          const user = await usersService.findOneById(decoded.sub);
          return { context: { user, headers: connectionParamsLowerKeys } };
        },
      },
    },
  }),
} as GqlModuleAsyncOptions<ApolloDriverConfig>;
