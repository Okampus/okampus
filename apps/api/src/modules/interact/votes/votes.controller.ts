import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { Content } from '@modules/create/contents/entities/content.entity';
import { User } from '@modules/uua/users/user.entity';
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
