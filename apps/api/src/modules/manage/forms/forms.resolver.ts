
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { CreateTeamFormDto } from '@modules/manage/forms/dto/create-team-form.dto';
import { Team } from '@modules/org/teams/team.entity';
import { User } from '@modules/uua/users/user.entity';
import { UpdateTeamFormDto } from './dto/update-team-form.dto';
import { TeamFormsService } from './forms.service';
import { TeamForm } from './team-form.entity';

@Resolver(() => TeamForm)
export class FormsResolver {
  constructor(
    private readonly formsService: TeamFormsService,
    @InjectRepository(Team) private readonly teamRepository:
      BaseRepository<Team>,
  ) {}

  @Mutation(() => Team)
  public async createTeamForm(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('createForm') createForm: CreateTeamFormDto,
  ): Promise<Team> {
    await this.formsService.create(user, id, createForm);
    return await this.teamRepository.findOneOrFail({ id });
  }

  @Mutation(() => TeamForm)
  public async updateTeamForm(
    @CurrentUser() user: User,
    @Args('id', { type: () => Int }) id: number,
    @Args('updateForm') updateForm: UpdateTeamFormDto,
  ): Promise<TeamForm> {
    return this.formsService.update(user, id, updateForm);
  }

  // TODO: Add permission checks
  @Query(() => TeamForm)
  public async teamFormById(@Args('id', { type: () => Int }) id: number): Promise<TeamForm> {
    return await this.formsService.findOne(id);
  }
}
