import type { JSONObject } from '@okampus/shared/types';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Content } from '../content.entity';
import type { ContentEditProps } from '@okampus/shared/dtos';

export type ContentEditOptions = ContentEditProps &
  TenantScopedOptions & {
    addedDiff: JSONObject | null;
    content: Content;
  };
