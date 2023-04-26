import { Field, InputType, Int } from '@nestjs/graphql';
import { Colors } from '@okampus/shared/enums';
import { Length, IsString, IsBoolean, IsOptional, IsInt, IsEnum } from 'class-validator';

@InputType()
export class EventRoleProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => Colors)
  @IsOptional()
  @IsEnum(Colors)
  color: Colors = Colors.Gray;

  @Field(() => String)
  @Length(1, 1000)
  @IsString()
  @IsOptional()
  description = '';

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  autoAccept?: boolean;

  @Field(() => Int)
  @IsInt()
  rewardMinimum!: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rewardMaximum?: number;
}
