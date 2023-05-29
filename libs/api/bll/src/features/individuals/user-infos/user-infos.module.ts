import { UserInfosService } from './user-infos.service';
import {
  UserInfosMutationResolver,
  UserInfosQueryAggregateResolver,
  UserInfosQueryResolver,
} from './user-infos.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserInfo } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([UserInfo])],
  providers: [UserInfosMutationResolver, UserInfosQueryResolver, UserInfosQueryAggregateResolver, UserInfosService],
  exports: [UserInfosService],
})
export class UserInfosModule {}
