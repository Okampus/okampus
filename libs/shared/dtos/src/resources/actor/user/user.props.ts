import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleType } from '@okampus/shared/enums';
import { ScopeRole } from '@okampus/shared/enums';

@InputType()
export class UserProps {
  @Field(() => String)
  @IsString()
  firstName!: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsString({ each: true })
  middleNames?: string[];

  @Field(() => String)
  @IsString()
  lastName!: string;

  @Field(() => [RoleType], { nullable: true })
  @IsOptional()
  @IsEnum(RoleType, { each: true })
  roles?: RoleType[];

  @Field(() => ScopeRole)
  @IsEnum(ScopeRole)
  scopeRole!: ScopeRole;
}
