import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from '../../../shared/modules/casl/casl-ability.factory';
import { User } from '../../../uua/users/user.entity';
import { Content } from '../../contents/entities/content.entity';
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
