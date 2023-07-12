import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CampusClusterProps {
  @Field(() => String)
  @IsString()
  name!: string;
}
