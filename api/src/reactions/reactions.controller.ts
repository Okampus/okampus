import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Content } from '../contents/entities/content.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { User } from '../users/user.entity';
import { ReactContentDto } from './dto/react-content.dto';
import type { Reaction } from './reaction.entity';
import { ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@Controller({ path: 'reactions' })
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
  ) {}

  @Post(':contentId')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async add(
    @CurrentUser() user: User,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() reactContentDto: ReactContentDto,
  ): Promise<Reaction> {
    return await this.reactionsService.add(user, contentId, reactContentDto.reaction);
  }

  @Get(':contentId')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findAll(
    @CurrentUser() user: User,
    @Param('contentId', ParseIntPipe) contentId: number,
  ): Promise<Reaction[]> {
    return await this.reactionsService.findAll(user, contentId);
  }

  @Delete(':contentId')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async remove(
    @CurrentUser() user: User,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() reactContentDto: ReactContentDto,
  ): Promise<void> {
    await this.reactionsService.remove(user, contentId, reactContentDto.reaction);
  }
}
