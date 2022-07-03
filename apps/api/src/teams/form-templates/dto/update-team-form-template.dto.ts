import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamFormTemplateDto } from './create-team-form-template.dto';

export class UpdateTeamFormTemplateDto extends PartialType(CreateTeamFormTemplateDto) {}
