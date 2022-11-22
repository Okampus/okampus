import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CanteensController } from './canteens.controller';
import { CanteensService } from './canteens.service';
import { FoodsModule } from './foods/foods.module';
import { Menu } from './menus/menu.entity';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Menu]),
    RouterModule.register([{
      path: 'restaurant',
      children: [
        { path: 'menus', module: MenusModule },
        { path: 'food', module: FoodsModule },
      ],
    }]),
    MenusModule,
    FoodsModule,
  ],
  controllers: [CanteensController],
  providers: [CanteensService],
  exports: [CanteensService],
})
export class CafeteriaModule {}
