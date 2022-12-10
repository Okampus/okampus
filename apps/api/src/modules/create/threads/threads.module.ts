import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tag } from '@catalog/tags/tag.entity';
import { Class } from '@classes/class.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { PubSubModule } from '@common/modules/pub-sub/pub-sub.module';
import { ContentsModule } from '@create/contents/contents.module';
import { Content } from '@create/contents/entities/content.entity';
import { Validation } from '@interact/validations/validation.entity';
import { ValidationsModule } from '@interact/validations/validations.module';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
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
