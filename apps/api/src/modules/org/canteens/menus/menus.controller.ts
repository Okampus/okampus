import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParseDatePipe } from '@common/lib/pipes/parse-date.pipe';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateMenuDto } from '@modules/org/canteens/menus/dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './menu.entity';
import { MenusService } from './menus.service';

@ApiTags('Menu')
@Controller()
export class MenusController {
  constructor(
    private readonly menuService: MenusService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Menu))
  public async create(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return await this.menuService.create(createMenuDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Menu))
  public async findAll(
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<Menu>> {
    return await this.menuService.findAll(query);
  }

  @Get(':date')
  @CheckPolicies(ability => ability.can(Action.Read, Menu))
  public async findOne(@Param('date', ParseDatePipe) date: Date): Promise<Menu> {
    return await this.menuService.findOne(date);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Menu))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ): Promise<Menu> {
    return await this.menuService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Menu))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.menuService.remove(id);
  }
}
