import { Field, InputType } from '@nestjs/graphql';
import { ScopeRole } from '@okampus/shared/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType()
export class IndividualProps {
  @Field(() => String)
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => ScopeRole)
  @IsEnum(ScopeRole)
  scopeRole!: ScopeRole;
}
