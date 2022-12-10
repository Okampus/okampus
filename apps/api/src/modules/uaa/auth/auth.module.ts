import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from '@common/modules/casl/casl.module';
import { TenantsCoreModule } from '@tenants/core-tenants.module';
import { User } from '@uaa/users/user.entity';
import { UsersModule } from '@uaa/users/users.module';
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
    CaslModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    AuthResolver,
    AuthController,
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
