import { ActorImagesService } from './actor-images.service';
import { 
  ActorImagesMutationResolver,
  ActorImagesQueryAggregateResolver, 
  ActorImagesQueryResolver
} from './actor-images.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ActorImage } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([ActorImage])],
  providers: [
    ActorImagesMutationResolver,
    ActorImagesQueryResolver, 
    ActorImagesQueryAggregateResolver,
    ActorImagesService
  ],
  exports: [ActorImagesService],
})
export class ActorImagesModule {}