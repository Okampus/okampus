import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../shared/configs/config';
import { MeiliSearchGlobal } from '../shared/modules/search/meilisearch.global';
import { TenantsCoreModule } from '../tenants/tenants/tenants.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { MyEfreiAuthGuard } from './myefrei-auth.guard';
import { buildOpenIdClient, MyEfreiStrategy } from './myefrei.strategy';

const MyEfreiStrategyFactory = {
  provide: 'OidcStrategy',
  useFactory: async (authService: AuthService): Promise<MyEfreiStrategy> => {
    const client = await buildOpenIdClient();
    return new MyEfreiStrategy(authService, client);
  },
  inject: [AuthService],
};

const myefreiStrategy = config.get('myefreiOidc.enabled')
  ? [MyEfreiStrategyFactory]
  : [];

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
    MyEfreiAuthGuard,
    AuthResolver,
    AuthController,
    MeiliSearchGlobal,
    ...myefreiStrategy,
  ],
  exports: [AuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
