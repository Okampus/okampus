import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialDto } from '@modules/org/teams/socials/dto/create-social.dto';

export class UpdateSocialDto extends PartialType(CreateSocialDto) {}
