import { Field, InputType, OmitType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

@InputType()
export class PreRegisterSsoDto extends OmitType(RegisterDto, ['password']) {
  @Field()
  @IsString()
  lastName!: string;

  @Field()
  @IsString()
  primaryEmail!: string;
}
