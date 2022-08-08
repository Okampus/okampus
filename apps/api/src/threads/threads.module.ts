import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
import { SchoolGroup } from '../school-group/school-group.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { PubSubModule } from '../shared/modules/pub-sub/pub-sub.module';
import { Tag } from '../tags/tag.entity';
import { Team } from '../teams/teams/team.entity';
import { User } from '../users/user.entity';
import { Validation } from '../validations/validation.entity';
import { ValidationsModule } from '../validations/validations.module';
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
