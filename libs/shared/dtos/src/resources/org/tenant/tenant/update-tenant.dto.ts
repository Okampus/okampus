import { CreateTenantDto } from './create-tenant.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @Field(() => String)
  id!: Snowflake;
}
