import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateTeamEventDto } from './create-team-event.dto';

@InputType()
export class UpdateTeamEventDto extends PartialType(OmitType(CreateTeamEventDto, ['templateId'])) {}
