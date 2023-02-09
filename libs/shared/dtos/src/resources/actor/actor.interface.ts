import type { ActorProps } from './actor.props';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { IActorImage } from '../manage-actor/actor-image/actor-image.interface';
import type { ISocial } from '../manage-actor/social/social.interface';
import type { ActorKind } from '@okampus/shared/enums';
import type { ITaggableEntity } from '../taggable-entity.interface';
import type { IIndividual } from './individual/individual.interface';
import type { IOrg } from '../org/org.interface';

export type IActor = ITenantScoped &
  ITaggableEntity &
  Required<ActorProps> & {
    individual?: IIndividual | null;
    org?: IOrg | null;
    actorKind: ActorKind;
    ical: string;
    actorImages: IActorImage[];
    socials: ISocial[];
  };
