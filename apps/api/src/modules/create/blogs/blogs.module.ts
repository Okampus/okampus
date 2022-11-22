import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@meta/shared/modules/casl/casl-ability.factory';
import { Tag } from '@modules/assort/tags/tag.entity';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
import { Blog } from './blog.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Blog, Content, Tag]),
    ContentsModule,
  ],
  controllers: [BlogsController],
  providers: [CaslAbilityFactory, BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
