import { UpdateTeamCommand } from './update-team.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';

import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamModel } from '../../../../factories/domains/teams/team.model';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler implements ICommandHandler<UpdateTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: UpdateTeamCommand): Promise<TeamModel> {
    const { id, ...updateTeam } = command.updateTeam;
    const canEdit = await this.teamFactory.canEditTeam(id, command.requester.id);
    if (!canEdit) throw new ForbiddenException('You are not allowed to edit this team');

    return await this.teamFactory.updateActor(
      command.tenant,
      { id },
      command.populate,
      updateTeam,
      async (team) => team,
      command.actorImages,
      canEdit
    );
  }
}
