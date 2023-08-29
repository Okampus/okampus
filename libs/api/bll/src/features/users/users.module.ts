import { UsersService } from './users.service';
import { UsersMutationResolver, UsersQueryAggregateResolver, UsersQueryResolver } from './users.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([User])],
  providers: [UsersMutationResolver, UsersQueryResolver, UsersQueryAggregateResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
