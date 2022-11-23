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
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
import { ReactContentDto } from './dto/react-content.dto';
import type { Reaction } from './reaction.entity';
import { ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@Controller({ path: 'reactions' })
export class ReactionsController {
  constructor(
    private readonly reactionsService: ReactionsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async add(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() reactContentDto: ReactContentDto,
  ): Promise<Reaction> {
    return await this.reactionsService.add(user, id, reactContentDto.reaction);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findAll(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Reaction[]> {
    return await this.reactionsService.findAll(user, id);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() reactContentDto: ReactContentDto,
  ): Promise<void> {
    await this.reactionsService.remove(user, id, reactContentDto.reaction);
  }
}
