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
import type { NoVote, Vote } from './vote.entity';
import { VotesService } from './votes.service';

@ApiTags('Votes')
@Controller({ path: 'votes' })
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
  ) {}

  @Put(':contentId')
  @CheckPolicies(ability => ability.can(Action.Interact, Content))
  public async add(
    @CurrentUser() user: User,
    @Param('contentId', ParseIntPipe) contentId: number,
    @Body() voteDto: VoteDto,
  ): Promise<NoVote | Vote> {
    if (voteDto.value === 0)
      return this.votesService.neutralize(user, contentId);
    return await this.votesService.update(user, contentId, voteDto.value);
  }

  @Get(':contentId')
  @CheckPolicies(ability => ability.can(Action.Read, Content))
  public async findAll(
    @CurrentUser() user: User,
    @Param('contentId', ParseIntPipe) contentId: number,
  ): Promise<NoVote | Vote> {
    return await this.votesService.findOne(user, contentId);
  }
}
