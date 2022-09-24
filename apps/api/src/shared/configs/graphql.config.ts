import { join } from 'node:path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
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
  driver: MercuriusDriver,
  bodyParserConfig: false,
  autoSchemaFile: join(process.cwd(), 'src', 'shared', 'lib', 'schema.gql'),
  sortSchema: true,
  debug: config.env.isDev(),
  playground: config.env.isDev(),
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
} as MercuriusDriverConfig;
