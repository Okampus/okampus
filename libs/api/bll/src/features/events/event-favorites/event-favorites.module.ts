import { EventFavoritesService } from './event-favorites.service';
import {
  EventFavoritesMutationResolver,
  EventFavoritesQueryAggregateResolver,
  EventFavoritesQueryResolver,
} from './event-favorites.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { EventFavorite } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([EventFavorite])],
  providers: [
    EventFavoritesMutationResolver,
    EventFavoritesQueryResolver,
    EventFavoritesQueryAggregateResolver,
    EventFavoritesService,
  ],
  exports: [EventFavoritesService],
})
export class EventFavoritesModule {}
