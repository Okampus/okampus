import { CreateUserDto } from './user-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => String)
  @IsString()
  id!: string;
}
