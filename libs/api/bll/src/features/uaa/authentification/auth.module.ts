import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Bot, Session, TenantCore, User } from '@okampus/api/dal';
import { UsersModule } from '../../../domains/resources/users/users.module';
import { BotsModule } from '../../../domains/resources/bots/bots.module';
import { TenantsModule } from '../../../domains/resources/tenants/tenants.module';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    BotsModule,
    TenantsModule,
    MikroOrmModule.forFeature([User, Bot, Session, TenantCore]),
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
