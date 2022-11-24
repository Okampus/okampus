import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTenantDto } from '@modules/org/tenants/dto/create-tenant.dto';

@InputType()
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}