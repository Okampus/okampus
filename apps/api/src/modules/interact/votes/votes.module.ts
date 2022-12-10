import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@create/contents/entities/content.entity';
import { User } from '@uaa/users/user.entity';
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
