import { PartialType } from '@nestjs/mapped-types';
import { CreateClubMemberDto } from './create-club-member.dto';

export class UpdateClubMemberDto extends PartialType(CreateClubMemberDto) {}
