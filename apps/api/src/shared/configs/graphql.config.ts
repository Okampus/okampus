import { join } from 'node:path';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type { GqlModuleAsyncOptions } from '@nestjs/graphql';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthenticationError, SyntaxError } from 'apollo-server-express';
import { JSONResolver } from 'graphql-scalars';
import type { Token } from '../../auth/auth.guard';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import type { TenantsService } from '../../tenants/tenants/tenants.service';
import type { User } from '../../users/user.entity';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { TENANT_ID_HEADER_NAME } from '../lib/constants';
import { computedConfig, config } from './config';

export interface GqlWebsocketContext {
  context: {
    user: User;
    tenant: Tenant;
    headers: object;
  };
}

export default {
  imports: [JwtModule, UsersModule, AuthModule],
  inject: [JwtService, UsersService, AuthService],
  driver: ApolloDriver,
  useFactory: (
    jwtService: JwtService,
    usersService: UsersService,
    authService: AuthService,
    tenantsService: TenantsService,
) => ({
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
      JSON: JSONResolver,
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
          const tenantToken: string = (TENANT_ID_HEADER_NAME.toLowerCase() in connectionParamsLowerKeys)
            && connectionParamsLowerKeys[TENANT_ID_HEADER_NAME.toLowerCase()];

          if (!wsToken)
            throw new AuthenticationError('WsToken not provided');

          if (!tenantToken)
            throw new AuthenticationError('Tenant token not provided');
          const tenant = await tenantsService.findOne(tenantToken);

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
          return { context: { user, tenant, headers: connectionParamsLowerKeys } };
        },
      },
    },
  }),
} as GqlModuleAsyncOptions<ApolloDriverConfig>;
