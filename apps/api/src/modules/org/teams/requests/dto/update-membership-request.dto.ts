import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamMembershipRequestDto } from '@modules/org/teams/requests/dto/create-membership-request.dto';

@InputType()
export class UpdateTeamMembershipRequestDto extends PartialType(CreateTeamMembershipRequestDto) {}