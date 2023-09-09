import { RequiredRolesService } from './required-roles.service';
import {
  RequiredRolesMutationResolver,
  RequiredRolesQueryAggregateResolver,
  RequiredRolesQueryResolver,
} from './required-roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RequiredRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([RequiredRole])],
  providers: [
    RequiredRolesMutationResolver,
    RequiredRolesQueryResolver,
    RequiredRolesQueryAggregateResolver,
    RequiredRolesService,
  ],
  exports: [RequiredRolesService],
})
export class RequiredRolesModule {}
