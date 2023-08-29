import { LocationsService } from './locations.service';
import {
  LocationsMutationResolver,
  LocationsQueryAggregateResolver,
  LocationsQueryResolver,
} from './locations.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Location } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Location])],
  providers: [LocationsMutationResolver, LocationsQueryResolver, LocationsQueryAggregateResolver, LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
