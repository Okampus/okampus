import { PartialType } from '@nestjs/mapped-types';
import { CreateTeamMembershipRequestDto } from './create-membership-request-copy.dto';

export class UpdateTeamMembershipRequestDto extends PartialType(CreateTeamMembershipRequestDto) {}
