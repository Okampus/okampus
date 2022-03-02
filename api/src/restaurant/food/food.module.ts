import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { FoodSearchService } from './food-search.service';
import { FoodController } from './food.controller';
import { Food } from './food.entity';
import { FoodService } from './food.service';


@Module({
  imports: [MikroOrmModule.forFeature([Food])],
  controllers: [FoodController],
  providers: [FoodService, FoodSearchService],
  exports: [FoodService],
})
export class FoodModule implements OnModuleInit {
  constructor(
    private readonly foodSearchService: FoodSearchService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.foodSearchService.init();
  }
}
