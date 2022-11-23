import { join } from 'node:path';
import { JwtModule, JwtService } from '@nestjs/jwt';
import type { MercuriusDriverConfig } from '@nestjs/mercurius';
import { MercuriusDriver } from '@nestjs/mercurius';
import { GraphQLJSON } from 'graphql-scalars';
import { GraphQLUpload } from 'graphql-upload-minimal';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { AuthModule } from '@modules/uua/auth/auth.module';
import { AuthService } from '@modules/uua/auth/auth.service';
import type { User } from '@modules/uua/users/user.entity';
import { UsersModule } from '@modules/uua/users/users.module';
import { UsersService } from '@modules/uua/users/users.service';

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
