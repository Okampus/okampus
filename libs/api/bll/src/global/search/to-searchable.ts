import { load } from '@okampus/api/shards';
import { ActorImageType } from '@okampus/shared/enums';

import { Team, Event, Individual } from '@okampus/api/dal';
import type { BaseSearchable, Searchable } from '@okampus/api/dal';

export function individualToSearchable(individual: Individual): BaseSearchable {
  if (!individual.actor) throw new Error('Actor is not defined.');

  const thumbnail =
    load(individual.actor.actorImages).find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
  const tags = load(individual.actor.tags).map((tag) => tag.name);

  return {
    name: individual.actor.name,
    slug: individual.actor.slug,
    tags,
    thumbnail,
    description: individual.actor.bio,
    entityType: 'individual',
    categories: [],
    createdAt: individual.createdAt.getTime(),
    // updatedAt: individual.updatedAt.getTime(),
    events: [],
    teams: [],
    individuals: [],
  };
}

export function teamToSearchable(team: Team): BaseSearchable {
  if (!team.actor) throw new Error('Actor is not defined.');

  const thumbnail =
    load(team.actor.actorImages).find((image) => image.type === ActorImageType.Avatar)?.image?.url ?? null;
  const categories = load(team.actor.tags).map((category) => category.name);
  const teams = load(team.children).map((team) => team.actor.name);

  return {
    slug: team.actor.slug,
    name: team.actor.name,
    thumbnail,
    description: team.actor.bio,
    categories,
    createdAt: team.createdAt.getTime(),
    // updatedAt: team.updatedAt.getTime(),
    individuals: [],
    events: [],
    teams,
    tags: [],
  };
}

export function eventToSearchable(event: Event): BaseSearchable {
  if (!event.content || !event.eventOrganizes) throw new Error('Event is not fully loaded.');

  const tags = load(event.tags).map((tag) => tag.name);
  const teams = load(event.eventOrganizes).map((manage) => manage.team.actor.name);

  return {
    slug: event.slug,
    name: event.name,
    thumbnail: event.banner?.url ?? null,
    description: event.content.text,
    categories: [event.state, ...(event.location?.address?.city ? [event.location.address.city] : [])],
    createdAt: event.createdAt.getTime(),
    // updatedAt: event.updatedAt.getTime(),
    individuals: [],
    events: [],
    teams,
    tags,
  };
}

export function toSearchable(entity: Searchable) {
  if (entity instanceof Individual) return individualToSearchable(entity);
  if (entity instanceof Team) return teamToSearchable(entity);
  if (entity instanceof Event) return eventToSearchable(entity);
  throw new Error('Unknown entity type.');
}
