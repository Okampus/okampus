import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTeamFileDto } from '@modules/store/team-files/dto/create-team-file.dto';

export class UpdateTeamFileDto extends PartialType(OmitType(CreateTeamFileDto, ['teamId'])) {}
