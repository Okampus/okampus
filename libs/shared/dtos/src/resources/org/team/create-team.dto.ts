import { InputType, IntersectionType } from '@nestjs/graphql';
import { ActorProps } from '../../actor/actor.props';
import { TeamProps } from './team.props';

@InputType()
export class CreateTeamDto extends IntersectionType(TeamProps, ActorProps) {}
