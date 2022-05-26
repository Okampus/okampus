import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTeamFileDto } from './create-team-file.dto';

export class UpdateTeamFileDto extends PartialType(OmitType(CreateTeamFileDto, ['teamId'])) {}
