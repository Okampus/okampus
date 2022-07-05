import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMembershipRequestDto } from './create-membership-request.dto';

export class UpdateTeamMembershipRequestDto extends PartialType(CreateTeamMembershipRequestDto) {}
