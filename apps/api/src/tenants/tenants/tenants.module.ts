import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { Tenant } from './tenant.entity';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Tenant]),
  ],
  controllers: [TenantsController],
  providers: [CaslAbilityFactory, TenantsService],
  exports: [TenantsService],
})
export class TenantsCoreModule {}
