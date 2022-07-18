import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Validation } from './entities/validation.entity';
import { ValidationsResolver } from './validations.resolver';
import { ValidationsService } from './validations.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Validation, Content]),
  ],
  providers: [ValidationsResolver, ValidationsService, CaslAbilityFactory],
  exports: [ValidationsService],
})
export class ValidationsModule {}
