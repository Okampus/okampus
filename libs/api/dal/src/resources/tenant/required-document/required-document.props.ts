import { Field, InputType } from '@nestjs/graphql';
import { TeamType } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class RequiredDocumentProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description = '';

  @Field(() => [TeamType], { nullable: true })
  @IsEnum(TeamType, { each: true })
  @IsOptional()
  teamTypes: TeamType[] = [];
}
