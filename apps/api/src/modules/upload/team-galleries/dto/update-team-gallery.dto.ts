import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeamGalleryDto } from '@modules/upload/team-galleries/dto/create-team-gallery.dto';

InputType();

export class UpdateTeamGalleryDto extends PartialType(OmitType(CreateTeamGalleryDto, ['teamId'])) {}
