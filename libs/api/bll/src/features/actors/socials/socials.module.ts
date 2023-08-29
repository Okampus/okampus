import { SocialsService } from './socials.service';
import { SocialsMutationResolver, SocialsQueryAggregateResolver, SocialsQueryResolver } from './socials.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Social } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Social])],
  providers: [SocialsMutationResolver, SocialsQueryResolver, SocialsQueryAggregateResolver, SocialsService],
  exports: [SocialsService],
})
export class SocialsModule {}
