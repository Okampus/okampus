import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OIDCStrategyCache } from '../shared/modules/authorization/oidc-strategy.cache';
import { MeiliSearchGlobal } from '../shared/modules/search/meilisearch.global';
import { TenantsCoreModule } from '../tenants/tenants/tenants.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TenantOidcAuthGuard } from './tenant-oidc-auth.guard';

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    JwtModule.register({}),
    UsersModule,
    TenantsCoreModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    TenantOidcAuthGuard,
    AuthResolver,
    AuthController,
    MeiliSearchGlobal,
    OIDCStrategyCache,
  ],
  exports: [AuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
