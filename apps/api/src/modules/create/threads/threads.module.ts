import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { PubSubModule } from '@meta/shared/modules/pub-sub/pub-sub.module';
import { Tag } from '@modules/assort/tags/tag.entity';
import { Validation } from '@modules/interact/validations/validation.entity';
import { ValidationsModule } from '@modules/interact/validations/validations.module';
import { Class } from '@modules/org/classes/class.entity';
import { Team } from '@modules/org/teams/team.entity';
import { User } from '@modules/uua/users/user.entity';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
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
      Class,
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
