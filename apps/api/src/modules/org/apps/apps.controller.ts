import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationArgs } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { App } from './app.entity';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';

@ApiTags('Apps')
@Controller({ path: 'apps' })
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, App))
  public async create(@Body() createAppDto: CreateAppDto): Promise<App> {
    return await this.appsService.create(createAppDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, App))
  public async findAll(
    @Query() query: PaginationArgs,
  ): Promise<PaginatedNodes<App>> {
    return await this.appsService.findAll(query);
  }

  @Get(':name')
  @CheckPolicies(ability => ability.can(Action.Read, App))
  public async findOne(@Param('name') name: string): Promise<App | null> {
    return await this.appsService.findOne(name);
  }

  @Patch(':name')
  @CheckPolicies(ability => ability.can(Action.Update, App))
  public async update(
    @Param('name') name: string,
    @Body() updateAppDto: UpdateAppDto,
  ): Promise<App> {
    return await this.appsService.update(name, updateAppDto);
  }

  @Delete(':name')
  @CheckPolicies(ability => ability.can(Action.Delete, App))
  public async remove(@Param('name') name: string): Promise<void> {
    await this.appsService.remove(name);
  }
}
