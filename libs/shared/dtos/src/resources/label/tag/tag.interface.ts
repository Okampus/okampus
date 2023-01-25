import { Colors } from '@okampus/shared/enums';
import { ITenantScopedEntity } from '../../tenant-scoped.interface';

export type ITag = ITenantScopedEntity & {
  name: string;
  color: Colors;
  description: string | null;
};
