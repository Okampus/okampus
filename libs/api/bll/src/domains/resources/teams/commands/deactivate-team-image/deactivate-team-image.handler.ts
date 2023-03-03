import { DeactivateTeamImageCommand } from './deactivate-team-image.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';

import type { ActorImageModel } from '../../../../factories/domains/images/actor-image.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeactivateTeamImageCommand)
export class DeactivateTeamImageHandler implements ICommandHandler<DeactivateTeamImageCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: DeactivateTeamImageCommand): Promise<ActorImageModel> {
    const canEdit = await this.teamFactory.canEditTeam(command.id, command.requester.id);
    if (!canEdit) throw new ForbiddenException('You are not allowed to edit this team');

    return await this.teamFactory.deactivateTeamImage(
      command.tenant,
      command.id,
      command.actorImageType,
      command.populate
    );
  }
}
