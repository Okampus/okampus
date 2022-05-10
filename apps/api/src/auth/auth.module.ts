import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../shared/configs/config';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
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
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    MyEfreiAuthGuard,
    ...myefreiStrategy,
  ],
  exports: [JwtAuthGuard, AuthService, JwtModule, UsersModule],
})
export class AuthModule {}
