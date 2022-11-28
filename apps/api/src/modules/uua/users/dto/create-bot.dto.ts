import { InputType, OmitType } from '@nestjs/graphql';
import { RegisterDto } from '@modules/uua/auth/dto/register.dto';

@InputType()
export class CreateBotDto extends OmitType(RegisterDto, ['password', 'lastName', 'roles']) {}
