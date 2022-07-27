import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SchoolGroupRole } from '../../../shared/lib/types/enums/school-group-role.enum';

@InputType()
export class CreateSchoolGroupMembershipDto {
  @Field(() => Int)
  @IsInt()
  schoolYearId: number;

  @Field(() => SchoolGroupRole)
  @IsOptional()
  @IsEnum(SchoolGroupRole)
  schoolGroupRole: SchoolGroupRole;
}
