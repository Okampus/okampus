import { AddressesService } from './addresses.service';
import { 
  AddressesMutationResolver,
  AddressesQueryAggregateResolver, 
  AddressesQueryResolver
} from './addresses.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Address } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Address])],
  providers: [
    AddressesMutationResolver,
    AddressesQueryResolver, 
    AddressesQueryAggregateResolver,
    AddressesService
  ],
  exports: [AddressesService],
})
export class AddressesModule {}