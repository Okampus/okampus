import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Canteen } from '../canteen.entity';

export type CanteenFoodOptions = TenantScopedOptions & {
  canteen: Canteen;
};
