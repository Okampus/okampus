import { TenantCore } from '@okampus/api/dal';

export class GetBotBySlugQuery {
  constructor(
    public readonly slug: string,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = ['tenant'] as never[]
  ) {}
}
