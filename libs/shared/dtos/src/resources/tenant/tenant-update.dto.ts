import '@nestjs/common';

import { CreateTenantDto } from './tenant-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import type { Snowflake } from '@okampus/shared/types';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @Field(() => String)
  id!: Snowflake;
}
