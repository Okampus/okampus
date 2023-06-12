import { ActorsService } from './actors.service';
import { ActorsMutationResolver, ActorsQueryAggregateResolver, ActorsQueryResolver } from './actors.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Actor } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, MikroOrmModule.forFeature([Actor])],
  providers: [ActorsMutationResolver, ActorsQueryResolver, ActorsQueryAggregateResolver, ActorsService],
  exports: [ActorsService],
})
export class ActorsModule {}