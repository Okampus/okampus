import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { Form, Org, Tag, Team, TeamOptions, TeamRepository, TenantCore } from '@okampus/api/dal';
import { ITeam } from '@okampus/shared/dtos';
import { loadTeam } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { TeamModel } from './team.model';

@Injectable()
export class TeamFactory extends BaseFactory<TeamModel, Team, ITeam, TeamOptions> {
  constructor(@Inject(EventPublisher) ep: EventPublisher, teamRepository: TeamRepository) {
    super(ep, teamRepository, TeamModel, Team);
  }

  entityToModel(entity: Team): TeamModel | undefined {
    const event = loadTeam(entity);
    if (!event) return undefined;
    return this.createModel(event);
  }

  modelToEntity(model: Required<TeamModel>): Team {
    return new Team({
      ...model,
      ...model.actor,
      parent: model.parent ? ({ id: model.parent.id } as Org) : null,
      joinForm: model.joinForm ? ({ id: model.joinForm.id } as Form) : null,
      tenant: { id: model.tenant.id } as TenantCore,
      tags: model.actor.tags.map((tag) => ({ id: tag.id } as Tag)),
    });
  }
}
