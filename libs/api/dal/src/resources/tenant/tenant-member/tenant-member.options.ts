import type { TenantMemberProps } from './tenant-member.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';

export type TenantMemberOptions = TenantMemberProps & TenantScopedOptions & { user: User };
