import { TenantCore } from '@okampus/api/dal';

export class GetTenantBySlugQuery {
  constructor(
    public readonly slug: string,
    public readonly tenant: TenantCore,
    public readonly populate = ['tenant'] as never[]
  ) {}
}