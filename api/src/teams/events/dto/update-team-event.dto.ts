import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamEventDto } from './create-team-event.dto';

export class UpdateTeamEventDto extends PartialType(CreateTeamEventDto) {}
