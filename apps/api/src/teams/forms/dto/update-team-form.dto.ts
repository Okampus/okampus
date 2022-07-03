import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamFormDto } from './create-team-form.dto';

export class UpdateTeamFormDto extends PartialType(CreateTeamFormDto) {}
