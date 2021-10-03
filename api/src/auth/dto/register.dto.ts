import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Length(3, 20)
  @Matches(/^[\w-]*$/)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 100)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
