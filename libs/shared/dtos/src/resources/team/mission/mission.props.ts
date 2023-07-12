import { Field, InputType, Int } from '@nestjs/graphql';
import { Colors } from '@okampus/shared/enums';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class MissionProps {
  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 20_000)
  @IsString()
  description?: string = '';

  @Field(() => Int)
  @IsNumber()
  pointsMinimum!: number;

  @Field(() => Int)
  @IsNumber()
  pointsMaximum!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  quantity?: number = 1;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isAutoAcceptingMembers?: boolean = false;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean = false;

  @Field(() => Colors, { nullable: true })
  @IsOptional()
  @IsEnum(Colors)
  color?: Colors = Colors.Blue;
}
