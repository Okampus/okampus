import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ClassRole } from '@meta/shared/lib/types/enums/class-role.enum';

@InputType()
export class CreateClassMembershipDto {
  @Field()
  @IsInt()
  schoolYearId: string;

  @Field(() => ClassRole)
  @IsOptional()
  @IsEnum(ClassRole)
  schoolGroupRole: ClassRole;
}
