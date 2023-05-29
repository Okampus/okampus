import { CreateBotDto } from './bot-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateBotDto extends PartialType(CreateBotDto) {
  @Field(() => String)
  @IsString()
  id!: string;
}
