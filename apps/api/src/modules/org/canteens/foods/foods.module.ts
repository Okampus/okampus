import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Food } from './food.entity';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';

@Module({
  imports: [MikroOrmModule.forFeature([Food])],
  controllers: [FoodsController],
  providers: [FoodsService],
  exports: [FoodsService],
})
export class FoodsModule {}
