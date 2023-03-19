import { UserModel, TeamModel, TenantEventModel } from '../../domains/factories';
import { load } from '@okampus/api/shards';
import { ActorImageType } from '@okampus/shared/enums';

import { Team, TenantEvent, User } from '@okampus/api/dal';
import type { BaseSearchable, Searchable } from '@okampus/api/dal';

export function userToSearchable(user: User | UserModel): BaseSearchable {
  if (!user.actor) throw new Error('Actor is not defined.');

  let thumbnail, linkedTeams;
  if (user instanceof UserModel) {
    thumbnail = user.actor.actorImages.find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
    // linkedTeams = user.teamMemberships.map((teamMember) => {
    //   if (!teamMember.team?.actor) throw new Error('Team is not defined.');
    //   return teamMember.team.actor.name;
    // });
    linkedTeams = ['yo'];
  } else {
    thumbnail = load(user.actor.actorImages).find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
    linkedTeams = load(user.teamMemberships).map((teamMember) => teamMember.team.actor.name);
  }

  return {
    slug: user.actor.slug,
    title: user.actor.name,
    thumbnail,
    description: user.actor.bio,
    categories: [user.scopeRole],
    createdAt: user.createdAt.getTime(),
    updatedAt: user.updatedAt.getTime(),
    linkedUsers: [],
    linkedEvents: [],
    linkedTeams,
    tags: [],
  };
}

export function teamToSearchable(team: Team | TeamModel): BaseSearchable {
  if (!team.actor) throw new Error('Actor is not defined.');

  let thumbnail, categories, linkedTeams: string[];
  if (team instanceof TeamModel) {
    thumbnail = team.actor.actorImages.find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
    categories = team.categories.map((category) => {
      if (!category.name) throw new Error('Category is not defined.');
      return category.name;
    });
    linkedTeams = []; // TODO: add children on TeamModel
  } else {
    thumbnail = load(team.actor.actorImages).find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
    categories = load(team.categories).map((category) => category.name);
    linkedTeams = load(team.children).map((team) => team.actor.name);
  }

  return {
    slug: team.actor.slug,
    title: team.actor.name,
    thumbnail,
    description: team.actor.bio,
    categories,
    createdAt: team.createdAt.getTime(),
    updatedAt: team.updatedAt.getTime(),
    linkedUsers: [],
    linkedEvents: [],
    linkedTeams,
    tags: [],
  };
}

export function eventToSearchable(event: TenantEvent | TenantEventModel): BaseSearchable {
  if (!event.rootContent || !event.rootContent.representingOrgs) throw new Error('Event is not fully loaded.');

  let tags: string[];
  let orgs: string[];
  // eslint-disable-next-line unicorn/prefer-ternary
  if (event instanceof TenantEventModel) {
    tags = event.tags.map((tag) => {
      if (!tag.name) throw new Error('Tag is not defined.');
      return tag.name;
    });
    orgs = event.orgs.map((org) => {
      if (!org.actor?.name) throw new Error('Org is not defined.');
      return org.actor.name;
    });
  } else {
    tags = load(event.tags).map((tag) => tag.name);
    orgs = load(event.orgs).map((org) => org.actor.name);
  }

  return {
    slug: event.slug,
    title: event.title,
    thumbnail: event.image?.url ?? null,
    description: event.rootContent.description,
    categories: [event.state, ...(event.location.city ? [event.location.city] : [])],
    createdAt: event.createdAt.getTime(),
    updatedAt: event.updatedAt.getTime(),
    linkedUsers: [],
    linkedEvents: [],
    linkedTeams: orgs,
    tags,
  };
}

export function toSearchable(entityOrModel: Searchable) {
  if (entityOrModel instanceof UserModel || entityOrModel instanceof User) return userToSearchable(entityOrModel);
  if (entityOrModel instanceof TeamModel || entityOrModel instanceof Team) return teamToSearchable(entityOrModel);
  if (entityOrModel instanceof TenantEventModel || entityOrModel instanceof TenantEvent)
    return eventToSearchable(entityOrModel);
  throw new Error('Unknown entity type.');
}
