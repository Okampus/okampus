import { join } from 'node:path';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JSONResolver } from 'graphql-scalars';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import type { User } from '../../users/user.entity';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
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
    'graphql-ws': true,
  },
  context: ({ extra, connectionParams }) => ({ ...extra, connectionParams }),

} as ApolloDriverConfig;
