import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../../shared/modules/casl/casl-ability.factory';
import { User } from '../../../uua/users/user.entity';
import { Content } from '../../contents/entities/content.entity';
import { Vote } from './vote.entity';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Content, Vote, User]),
  ],
  controllers: [VotesController],
  providers: [CaslAbilityFactory, VotesService],
  exports: [VotesService],
})
export class VotesModule {}
