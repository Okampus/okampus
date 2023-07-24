import { allFormatters } from '../../config/i18n';
import { isNonNullObject, includes } from '@okampus/shared/utils';

import type { Format } from '../../config/i18n';
import type { DeterminerType, Determiners } from '../../ssr/getTranslation';

export function interpolate(
  str: string,
  data: TOptions,
  format: Format,
  dict: unknown,
  determiners: Determiners
): string | undefined {
  return str.replaceAll(/{{\s*([^\s,}]+?)\s*(?:,\s*([^\s}]+?))?\s*}}/g, (_, dataKey: string, contextValue: string) => {
    const hasDynamicContext = contextValue && contextValue.at(0) === '[' && contextValue.at(-1) === ']';
    if (dataKey.at(0) === "'" && dataKey.at(-1) === "'") {
      const key = dataKey.slice(1, -1);
      let context = data;
      if (hasDynamicContext) {
        context = Object.fromEntries(
          contextValue
            .slice(1, -1)
            .split(',')
            .map((v) => {
              const value = v.trim();
              if (value.includes(':')) {
                const [key, contextKey] = value.split(':');
                return [key.trim(), contextKey.trim()];
              } else {
                return [value, value];
              }
            })
            .map(([key, contextKey]) => [key, data[contextKey]])
        );
      }
      return translate(dict, key, context, format, determiners);
    }

    if (hasDynamicContext) {
      const formatterKey = contextValue.slice(1, -1).trim();
      if (includes(formatterKey, allFormatters)) return format(formatterKey, data[dataKey]);
    } else if (contextValue && includes(contextValue, allFormatters)) return format(contextValue, data[dataKey]);

    return data[dataKey];
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TOptions = { [key: string]: any } & { count?: number | 'other'; determinerType?: DeterminerType };
export function translate(dict: unknown, key: string, data: TOptions, format: Format, determiners: Determiners) {
  // eslint-disable-next-line unicorn/no-array-reduce
  const value = key.split('.').reduce((o, i) => (isNonNullObject(o) ? o[i] : o), dict);
  if (typeof value === 'string') return interpolate(value, data, format, dict, determiners) ?? key;

  if (isNonNullObject(value)) {
    const cardinal = typeof data.count === 'number' ? format('cardinal', data.count ?? 1) : 'other';
    const subValue = value[cardinal] || value.other || value.one || value.value;
    const result = interpolate(subValue as string, data, format, dict, determiners);
    if (!result) return key;
    if (!data.determinerType) return result;
    const valueDeterminer = (value.determinerType || Object.keys(determiners)[0]) as string;
    return `${determiners[valueDeterminer][data.determinerType]}${result}`;
  }

  return key;
}
