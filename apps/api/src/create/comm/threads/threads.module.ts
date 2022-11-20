import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tag } from '../../../org/data/tags/tag.entity';
import { SchoolGroup } from '../../../org/school-group/school-group.entity';
import { Team } from '../../../org/teams/teams/team.entity';
import { CaslAbilityFactory } from '../../../shared/modules/casl/casl-ability.factory';
import { PubSubModule } from '../../../shared/modules/pub-sub/pub-sub.module';
import { User } from '../../../uua/users/user.entity';
import { Validation } from '../../../validations/validation.entity';
import { ValidationsModule } from '../../../validations/validations.module';
import { ContentsModule } from '../../contents/contents.module';
import { Content } from '../../contents/entities/content.entity';
import { Thread } from './thread.entity';
import { ThreadsController } from './threads.controller';
import { ThreadResolver } from './threads.resolver';
import { ThreadsService } from './threads.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Thread,
      Tag,
      User,
      Content,
      Validation,
      SchoolGroup,
      Team,
    ]),
    ContentsModule,
    ValidationsModule,
    PubSubModule,
  ],
  controllers: [ThreadsController],
  providers: [CaslAbilityFactory, ThreadsService, ThreadResolver],
  exports: [ThreadsService],
})
export class ThreadsModule {}
