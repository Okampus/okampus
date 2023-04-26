import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Canteen } from '../canteen.entity';

export type CanteenMenuOptions = TenantScopedOptions & {
  canteen: Canteen;
};
