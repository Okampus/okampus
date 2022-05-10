import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Content } from '../contents/entities/content.entity';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Favorite } from './favorite.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([Favorite, Content]),
  ],
  controllers: [FavoritesController],
  providers: [CaslAbilityFactory, FavoritesService],
  exports: [],
})
export class FavoritesModule {}
