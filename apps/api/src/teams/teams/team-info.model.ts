
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.entity';
import { TeamMember } from '../members/team-member.entity';
import { MembershipRequestState } from '../types/membership-request-state.enum';
import { Team } from './team.entity';

@ObjectType()
export class TeamInfo extends Team {
    @Field(() => TeamMember, { nullable: true })
    membership: TeamMember | null;

    @Field(() => MembershipRequestState, { nullable: true })
    requestStatus: MembershipRequestState | null;

    @Field(() => Int)
    memberCount: number;

    @Field(() => User, { nullable: true })
    owner?: User | null;

    @Field(() => User, { nullable: true })
    secretary?: User | null;

    @Field(() => User, { nullable: true })
    treasurer?: User | null;
}
