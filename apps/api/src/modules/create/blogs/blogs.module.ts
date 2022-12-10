import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tag } from '@catalog/tags/tag.entity';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { ContentsModule } from '@create/contents/contents.module';
import { Content } from '@create/contents/entities/content.entity';
import { Blog } from './blog.entity';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

@Module({
  imports: [MikroOrmModule.forFeature([Blog, Content, Tag]), ContentsModule],
  controllers: [BlogsController],
  providers: [CaslAbilityFactory, BlogsService],
  exports: [BlogsService],
})
export class BlogsModule {}
