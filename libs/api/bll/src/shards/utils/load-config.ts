import type { ConfigService } from '@nestjs/config';

type NonUndefined<T> = T extends undefined ? never : T;
export function loadConfig<T>(config: ConfigService, configPath: string): NonUndefined<T> {
  const data = config.get(configPath);
  if (data === undefined) throw new Error(`Missing config at ${configPath}.`);
  return data;
}
