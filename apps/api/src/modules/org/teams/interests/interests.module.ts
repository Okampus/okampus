import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
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
