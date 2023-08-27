import { LegalUnitLocationsService } from './legal-unit-locations.service';
import { 
  LegalUnitLocationsMutationResolver,
  LegalUnitLocationsQueryAggregateResolver, 
  LegalUnitLocationsQueryResolver
} from './legal-unit-locations.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { LegalUnitLocation } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([LegalUnitLocation])],
  providers: [
    LegalUnitLocationsMutationResolver,
    LegalUnitLocationsQueryResolver, 
    LegalUnitLocationsQueryAggregateResolver,
    LegalUnitLocationsService
  ],
  exports: [LegalUnitLocationsService],
})
export class LegalUnitLocationsModule {}