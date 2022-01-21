import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MyEfreiDto {
  @IsString()
  username: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
