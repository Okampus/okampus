import { PartialType } from '@nestjs/swagger';
import { CreateSocialAccountDto } from './create-social-account.dto';

export class UpdateSocialAccountDto extends PartialType(CreateSocialAccountDto) {}
