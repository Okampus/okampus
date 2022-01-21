import { IsString, Length } from 'class-validator';
import { MyEfreiDto } from './my-efrei.dto';

export class RegisterDto extends MyEfreiDto {
  @IsString()
  @Length(6, 100)
  password: string;
}
