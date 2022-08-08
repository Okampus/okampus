import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ContentsModule } from '../contents/contents.module';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Tag } from '../tags/tag.entity';
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
