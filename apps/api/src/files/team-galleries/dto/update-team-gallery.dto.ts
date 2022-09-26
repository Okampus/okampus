import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeamGalleryDto } from './create-team-gallery.dto';

InputType();

export class UpdateTeamGalleryDto extends PartialType(OmitType(CreateTeamGalleryDto, ['teamId'])) {}
