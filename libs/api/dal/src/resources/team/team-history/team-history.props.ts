import { Field, InputType } from '@nestjs/graphql';
import { ApproximateDate, TeamHistoryEventType } from '@okampus/shared/enums';
import { IsDate, IsEnum } from 'class-validator';

@InputType()
export class TeamHistoryProps {
  @Field(() => ApproximateDate)
  @IsEnum(ApproximateDate)
  approximateDate!: ApproximateDate;

  @Field(() => Date)
  @IsDate()
  eventDate!: Date;

  @Field(() => TeamHistoryEventType)
  @IsEnum(TeamHistoryEventType)
  eventType!: TeamHistoryEventType;
}
