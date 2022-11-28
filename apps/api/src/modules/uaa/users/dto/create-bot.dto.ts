import { InputType, OmitType } from '@nestjs/graphql';
import { RegisterDto } from '@modules/uaa/auth/dto/register.dto';

@InputType()
export class CreateBotDto extends OmitType(RegisterDto, ['password', 'lastName', 'roles']) {}
