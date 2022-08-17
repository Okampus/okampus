import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTeamGalleryDto } from './create-team-gallery.dto';

export class UpdateTeamGalleryDto extends PartialType(OmitType(CreateTeamGalleryDto, ['id'])) {}
