import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { Food } from './food.entity';
import { FoodService } from './food.service';

@Module({
  imports: [MikroOrmModule.forFeature([Food])],
  controllers: [FoodController],
  providers: [FoodService],
  exports: [FoodService],
})
export class FoodModule {}
