import { DeactivateTeamImageCommand } from './deactivate-team-image.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageFactory } from '../../../../factories/domains/images/actor-image.factory';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { OrgKind } from '@okampus/shared/enums';

import type { ActorImageModel } from '../../../../factories/domains/images/actor-image.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeactivateTeamImageCommand)
export class DeactivateTeamImageHandler implements ICommandHandler<DeactivateTeamImageCommand> {
  constructor(private readonly actorImageFactory: ActorImageFactory, private readonly teamFactory: TeamFactory) {}

  async execute(command: DeactivateTeamImageCommand): Promise<ActorImageModel> {
    const canEdit = await this.teamFactory.canEditTeam(command.id, command.requester.id);
    if (!canEdit) throw new ForbiddenException('You are not allowed to edit this team');

    return await this.actorImageFactory.deactivate(
      { org: { id: command.id, orgKind: OrgKind.Team } },
      command.actorImageType,
      command.tenant,
      command.populate,
      true
    );
  }
}
