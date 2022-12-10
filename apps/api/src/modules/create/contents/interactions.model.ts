import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Reaction } from '@interact/reactions/reaction.entity';
import { Report } from '@interact/reports/report.entity';

@ObjectType()
export class Interactions {
  @Field(() => [Reaction])
  reactions: Reaction[];

  @Field(() => Boolean)
  userFavorited: boolean;

  @Field(() => Int, { nullable: true })
  userVoted: number;

  @Field(() => Report, { nullable: true })
  userReported: Report | null;
}
