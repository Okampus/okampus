import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTenantDto } from './create-tenant.dto';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
