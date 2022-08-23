
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { User } from '../../users/user.entity';
import { Team } from '../teams/team.entity';
import { CreateTeamFormDto } from './dto/create-team-form.dto';
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
