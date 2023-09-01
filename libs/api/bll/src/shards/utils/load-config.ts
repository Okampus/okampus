import type { ApiConfig, DeepProperty, NestedKeyOf } from '@okampus/shared/types';
import type { ConfigService } from '@nestjs/config';

export function loadConfig<T extends NestedKeyOf<ApiConfig>>(
  config: ConfigService,
  configPath: T,
): DeepProperty<ApiConfig, T> {
  const data = config.get(configPath);
  if (data === undefined) throw new Error(`Missing config at ${configPath}.`);
  return data;
}
