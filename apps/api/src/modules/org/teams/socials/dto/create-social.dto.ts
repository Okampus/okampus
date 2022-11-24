import { IsEnum, IsString } from 'class-validator';
import { SocialAccountType } from '@common/lib/types/enums/social-account-type.enum';

export class CreateSocialDto {
  @IsEnum(SocialAccountType)
  socialType: SocialAccountType;

  @IsString()
  link: string;

  @IsString()
  pseudo: string;
}