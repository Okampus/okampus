import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { Tag } from '../tags/tag.entity';
import { UsersModule } from '../users/users.module';
import { PostVote } from './entities/post-vote.entity';
import { Post } from './entities/post.entity';
import { PostVotesService } from './post-votes.service';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Post, PostVote, Tag]),
    AuthModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostVotesService],
  exports: [PostsService],
})
export class PostsModule {}
