import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamFormDto } from '@modules/manage/forms/dto/create-team-form.dto';

@InputType()
export class UpdateTeamFormDto extends PartialType(CreateTeamFormDto) {}
