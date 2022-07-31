import { Field, ObjectType } from '@nestjs/graphql';
import { TeamMember } from '../members/team-member.entity';

@ObjectType()
export class TeamMembershipStatus {
    @Field(() => TeamMember, { nullable: true })
    membership: TeamMember | null;

    @Field(() => Boolean)
    pendingRequest: boolean;
}
