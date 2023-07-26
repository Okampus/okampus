import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Actor } from '../../actor/actor.entity';
import type { Content } from '../content.entity';
import type { ReportProps } from './report.props';

export type ReportOptions = ReportProps &
  TenantScopedOptions & {
    lastActiveDate?: Date | null;
    actor?: Actor | null;
    content?: Content | null;
  };
