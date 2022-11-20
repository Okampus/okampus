import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSchoolGroupMembershipDto } from './create-school-group-membership.dto';

@InputType()
export class UpdateSchoolGroupMembershipDto extends PartialType(CreateSchoolGroupMembershipDto) {}
