import { Field, InputType, PartialType } from '@nestjs/graphql';
import { UUID } from '@okampus/shared/types';
import { CreateTenantDto } from './create-tenant.dto';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {
  @Field(() => String)
  id!: UUID;
}
