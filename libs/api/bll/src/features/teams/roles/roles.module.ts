import { RolesService } from './roles.service';
import { 
  RolesMutationResolver,
  RolesQueryAggregateResolver, 
  RolesQueryResolver
} from './roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Role } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Role])],
  providers: [
    RolesMutationResolver,
    RolesQueryResolver, 
    RolesQueryAggregateResolver,
    RolesService
  ],
  exports: [RolesService],
})
export class RolesModule {}