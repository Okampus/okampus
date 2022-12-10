import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialDto } from '@teams/socials/dto/create-social.dto';

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}
