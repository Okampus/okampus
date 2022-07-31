
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/user.entity';
import { Team } from './team.entity';

@ObjectType()
export class TeamInfo extends Team {
    @Field(() => User, { nullable: true })
    owner?: User | null;

    @Field(() => User, { nullable: true })
    secretary?: User | null;

    @Field(() => User, { nullable: true })
    treasurer?: User | null;
}
