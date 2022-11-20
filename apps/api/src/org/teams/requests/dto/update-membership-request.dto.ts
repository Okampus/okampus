import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTeamMembershipRequestDto } from './create-membership-request.dto';

@InputType()
export class UpdateTeamMembershipRequestDto extends PartialType(CreateTeamMembershipRequestDto) {}
