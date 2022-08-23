import { join } from 'node:path';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { JwtModule, JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { GraphQLJSON } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload-minimal';
import { AuthModule } from '../../auth/auth.module';
import { AuthService } from '../../auth/auth.service';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import type { User } from '../../users/user.entity';
import { UsersModule } from '../../users/users.module';
import { UsersService } from '../../users/users.service';
import { config } from './config';

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
  debug: config.env.isDev(),
  cache: 'bounded',
  playground: config.env.isDev(),
  cors: (req: Request, callback: (err: Error | null, result: { origin: boolean; credentials: boolean }) => void) => {
    const origin = req.header('origin');
    callback(null,
      {
        origin: origin ? /^https:\/\/(?:[\dA-Za-z][\dA-Za-z-]{1,61}[\dA-Za-z])+\.okampus\.fr$/.test(origin) : false,
        credentials: true,
      });
  },
  uploads: false,
  resolvers: {
    JSON: GraphQLJSON,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Upload: GraphQLUpload,
  },
  installSubscriptionHandlers: true,

  subscriptions: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'graphql-ws': true,
  },
  context: ({ extra, connectionParams }) => ({ ...extra, connectionParams }),

} as ApolloDriverConfig;
