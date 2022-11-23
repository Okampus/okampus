import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamFormDto } from '@modules/org/teams/forms/dto/create-team-form.dto';

@InputType()
export class UpdateTeamFormDto extends PartialType(CreateTeamFormDto) {}
