import { RegisterDto } from './register.dto';
import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class PreRegisterSsoDto extends OmitType(RegisterDto, ['password']) {
  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsString()
  primaryEmail!: string;
}
