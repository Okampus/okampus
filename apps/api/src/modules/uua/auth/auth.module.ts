import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TenantsCoreModule } from '@modules/org/tenants/core-tenants.module';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

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
    AuthResolver,
    AuthController,
  ],
  exports: [AuthGuard, AuthService, JwtModule],
})
export class AuthModule {}
