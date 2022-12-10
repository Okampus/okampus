import { InputType, PartialType } from '@nestjs/graphql';
import { RegisterDto } from '@uaa/auth/dto/register.dto';

@InputType()
export class UpdateUserDto extends PartialType(RegisterDto) {}
