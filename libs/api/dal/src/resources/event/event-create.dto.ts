import { EventProps } from './event.props';
import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';

@InputType()
export class CreateEventDto extends EventProps {
  @Field(() => String)
  @IsString()
  supervisorId!: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  orgIds!: string[];
}
