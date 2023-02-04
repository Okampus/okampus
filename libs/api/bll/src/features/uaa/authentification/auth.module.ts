import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../../../domains/resources/users/users.module';
import { BotsModule } from '../../../domains/resources/bots/bots.module';
import { TenantsModule } from '../../../domains/resources/tenants/tenants.module';
import { Bot, Session, Tenant, TenantCore, User } from '@okampus/api/dal';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    BotsModule,
    TenantsModule,
    MikroOrmModule.forFeature([User, Bot, Session, Tenant, TenantCore]),
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
