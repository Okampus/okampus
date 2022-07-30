import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SchoolGroupRole } from '../../../shared/lib/types/enums/school-group-role.enum';

@InputType()
export class CreateSchoolGroupMembershipDto {
  @Field()
  @IsInt()
  schoolYearId: string;

  @Field(() => SchoolGroupRole)
  @IsOptional()
  @IsEnum(SchoolGroupRole)
  schoolGroupRole: SchoolGroupRole;
}
