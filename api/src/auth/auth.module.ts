import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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

@Module({
  imports: [
    MikroOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule.register({}),
    UsersModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, MyEfreiAuthGuard, MyEfreiStrategyFactory],
  exports: [JwtAuthGuard, AuthService, JwtModule, ConfigModule, UsersModule],
})
export class AuthModule {}
