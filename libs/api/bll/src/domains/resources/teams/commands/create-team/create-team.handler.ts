import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Actor, BaseRepository } from '@okampus/api/dal';
import { TeamFactory } from '../../../../factories/teams/team.factory';
import { TeamModel } from '../../../../factories/teams/team.model';
import { CreateTeamCommand } from './create-team.command';

@CommandHandler(CreateTeamCommand)
export class CreateTeamHandler implements ICommandHandler<CreateTeamCommand> {
  constructor(
    private readonly teamFactory: TeamFactory,
    @InjectRepository(Actor) private readonly actorRepository: BaseRepository<Actor>
  ) {}

  async execute(command: CreateTeamCommand): Promise<TeamModel> {
    // Ensure that slug is unique within the tenant
    const tenant = command.tenant;

    const existingActor = await this.actorRepository.findOne({ slug: command.createTeam.slug, tenant });
    if (existingActor) throw new ForbiddenException(`Team with slug '${command.createTeam.slug}'`);

    return this.teamFactory.create({ ...command.createTeam, tenant });
  }
}
