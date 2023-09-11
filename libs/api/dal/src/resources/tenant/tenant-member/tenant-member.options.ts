import type { TenantMemberProps } from './tenant-member.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';
import type { TenantRole } from '../tenant-role/tenant-role.entity';

export type TenantMemberOptions = TenantMemberProps & TenantScopedOptions & { role: TenantRole; user: User };
