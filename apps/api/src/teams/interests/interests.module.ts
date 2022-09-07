import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';
import { Interest } from './interest.entity';
import { InterestsResolver } from './interest.resolver';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Interest, Team, User]),
  ],
  controllers: [InterestsController],
  providers: [CaslAbilityFactory, InterestsService, InterestsResolver],
  exports: [InterestsService],
})
export class InterestsModule {}
