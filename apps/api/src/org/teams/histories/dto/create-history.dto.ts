import { Field, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { TeamHistoryState } from '../../../../shared/lib/types/enums/team-history-state.enum';

export class CreateHistoryDto {
  @Field(() => Int, { nullable: true })
  @IsInt()
  day: number | null = null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  month: number | null = null;

  @Field(() => Int)
  @IsInt()
  year: number;

  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => Int)
  @IsInt()
  teamId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  parentId: number | null = null;

  @Field(() => TeamHistoryState)
  @IsEnum(TeamHistoryState)
  state: TeamHistoryState;
}
