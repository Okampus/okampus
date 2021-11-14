import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsLowercase()
  @Length(3, 20)
  @Matches(/^[\w-]*$/)
  username: string;

  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
