import { LegalUnitsService } from './legal-units.service';
import {
  LegalUnitsMutationResolver,
  LegalUnitsQueryAggregateResolver,
  LegalUnitsQueryResolver,
} from './legal-units.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { LegalUnit } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([LegalUnit])],
  providers: [LegalUnitsMutationResolver, LegalUnitsQueryResolver, LegalUnitsQueryAggregateResolver, LegalUnitsService],
  exports: [LegalUnitsService],
})
export class LegalUnitsModule {}
