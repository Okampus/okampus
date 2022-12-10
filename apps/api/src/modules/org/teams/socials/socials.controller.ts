import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { CreateSocialDto } from '@teams/socials/dto/create-social.dto';
import { User } from '@uaa/users/user.entity';
import { UpdateSocialDto } from './dto/update-social.dto';
import type { Social } from './social.entity';
import { SocialsService } from './socials.service';

// TODO: check policies
@ApiTags('Socials')
@Controller({ path: 'socials' })
export class SocialsController {
  constructor(
    private readonly socialsService: SocialsService,
  ) {}

  @Post()
  public async createSocial(
    @Body() createSocial: CreateSocialDto,
    @CurrentUser() user: User,
  ): Promise<Social> {
    return await this.socialsService.createSocial(user, createSocial);
  }

  @Get(':id')
  public async findAllUserSocials(@Param('id') id: string): Promise<Social[]> {
    return await this.socialsService.findAllUserSocials(id);
  }

  @Patch(':id')
  public async updateSocial(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSocialDto: UpdateSocialDto,
    @CurrentUser() user: User,
  ): Promise<Social> {
    return await this.socialsService.updateSocial(user, id, updateSocialDto);
  }

  @Delete(':id')
  public async deleteSocial(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.socialsService.deleteSocial(user, id);
  }
}
