import { Field, ObjectType } from '@nestjs/graphql';
import { TeamMember } from '../members/team-member.entity';
import { MembershipRequestState } from '../types/membership-request-state.enum';

@ObjectType()
export class TeamMembershipStatus {
    @Field(() => TeamMember, { nullable: true })
    membership: TeamMember | null;

    @Field(() => MembershipRequestState, { nullable: true })
    requestStatus: MembershipRequestState | null;
}
