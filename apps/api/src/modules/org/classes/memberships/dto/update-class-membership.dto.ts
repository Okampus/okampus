import { InputType, PartialType } from '@nestjs/graphql';
import { CreateClassMembershipDto } from '@modules/org/classes/memberships/dto/create-class-membership.dto';

@InputType()
export class UpdateClassMembershipDto extends PartialType(CreateClassMembershipDto) {}
