import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Reaction } from '../reactions/reaction.entity';
import { Report } from '../reports/report.entity';

@ObjectType()
export class ContentInteractions {
  @Field(() => [Reaction])
  reactions: Reaction[];

  @Field(() => Boolean)
  userFavorited: boolean;

  @Field(() => Int, { nullable: true })
  userVoted: number;

  @Field(() => Report, { nullable: true })
  userReported: Report | null;
}
