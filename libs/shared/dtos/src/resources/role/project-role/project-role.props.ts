import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class ProjectRoleProps {
  @Field(() => String)
  @Length(1, 1000)
  @IsString()
  description!: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  autoAccept?: boolean;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rewardMinimum: number | null = null;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  rewardMaximum: number | null = null;
}
