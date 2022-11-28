import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '@common/modules/casl/casl-ability.factory';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uaa/users/user.entity';
import { Favorite } from './favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Favorite, Content, User]),
  ],
  controllers: [FavoritesController],
  providers: [CaslAbilityFactory, FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
