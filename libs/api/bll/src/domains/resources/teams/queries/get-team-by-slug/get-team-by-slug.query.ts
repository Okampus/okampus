import type { TenantCore } from '@okampus/api/dal';

export class GetTeamBySlugQuery {
  constructor(
    public readonly slug: string,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = <never[]>['tenant']
  ) {}
}
