import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HasuraModule } from '../graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { Individual, Session, Tenant } from '@okampus/api/dal';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HasuraModule,
    JwtModule.register({}),
    MikroOrmModule.forFeature([Individual, Session, Tenant]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
