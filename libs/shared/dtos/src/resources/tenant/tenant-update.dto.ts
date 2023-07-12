import '@nestjs/common';

import { CreateTenantDto } from './tenant-create.dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @Field(() => String)
  id!: string;
}
