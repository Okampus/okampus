import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Content } from '../contents/entities/content.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { User } from '../users/user.entity';
import { VoteDto } from './dto/vote.dto';
import type { Vote } from './vote.entity';
import { VotesService } from './votes.service';

@ApiTags('Votes')
@Controller({ path: 'votes' })
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
  ) {}

  @Put(':id')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async add(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() voteDto: VoteDto,
  ): Promise<Content> {
    return await this.votesService.update(user, id, voteDto.value);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Vote | null> {
    return await this.votesService.findOne(user, id);
  }
}
