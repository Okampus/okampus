import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamFormDto } from './create-team-form.dto';

@InputType()
export class UpdateTeamFormDto extends PartialType(CreateTeamFormDto) {}
