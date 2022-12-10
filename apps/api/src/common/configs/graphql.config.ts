import { join } from 'node:path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GraphQLJSON } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload-minimal';
import type { Tenant } from '@tenants/tenant.entity';
import { AuthModule } from '@uaa/auth/auth.module';
import { AuthService } from '@uaa/auth/auth.service';
import type { User } from '@uaa/users/user.entity';
import { UsersModule } from '@uaa/users/users.module';
import { UsersService } from '@uaa/users/users.service';

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
  autoSchemaFile: join(process.cwd(), 'src', 'common', 'lib', 'schema.gql'),
  resolvers: {
    JSON: GraphQLJSON,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Upload: GraphQLUpload,
  },
  subscription: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'graphql-ws': true,
  },
} as MercuriusDriverConfig;
