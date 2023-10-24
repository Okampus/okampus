import { allFormatters } from '../../config/i18n';
import { isNonNullObject, includes, isKey } from '@okampus/shared/utils';

import type { Format } from '../../config/i18n';
import type { DeterminerType, Determiners, IntlDict, IntlDictsCache } from '../../server/ssr/getTranslation';

export function interpolate(
  str: string,
  data: TOptions,
  context: TranslateContext & { currentDict: IntlDict },
): string | undefined {
  // Matches the following:
  // {{ myKey }} -> data (1)
  // {{ myKey, myContext }} -> data with custom contexts (2)
  // {{ 'staticKeyInCurrentDict' }} -> static key in current dict (3)
  // {{ 'dict:staticKey' }} -> static key in another dict (4)
  // {{ 'dict:staticKey', ['context1', 'context2'] }} -> static key with dynamic context (5)
  // {{ 'dict:staticKey', ['context1:ctx1', 'context2'] }} -> static key with dynamic context (mapping a data to another context) (5)

  return str.replaceAll(/{{\s*([^\s,}]+?)\s*(?:,\s*([^\s}]+?))?\s*}}/g, (_, dataKey: string, contextValue: string) => {
    const hasDynamicContext = contextValue && contextValue.at(0) === '[' && contextValue.at(-1) === ']';
    if (hasDynamicContext) contextValue = contextValue.slice(1, -1);

    // Refer to another key with context
    const hasStaticKey = dataKey.at(0) === "'" && dataKey.at(-1) === "'";
    if (hasStaticKey) {
      // (3)
      const key = dataKey.slice(1, -1);
      let dict: IntlDict | undefined = context.currentDict;
      if (dataKey.includes(':')) {
        // (4)
        const dictKey = dataKey.split(':')[0];
        dict = isKey(dictKey, context.dicts) ? context.dicts[dictKey] : dict;
      }

      let dataContext = data;
      if (hasDynamicContext) {
        dataContext = Object.fromEntries(
          contextValue
            .split(',')
            .map((value) => {
              const dataMap = value.trim().split(':');
              if (dataMap.length === 1) return [dataMap[0], dataMap[0]];
              if (dataMap.length === 2) return dataMap;
              return [];
            })
            .map(([key, contextKey]) => [key, data[contextKey]]),
        );
      }

      if (!dict) return key;
      return translate(dict, key, dataContext, context);
    }

    // Refer to current key with context
    if (hasDynamicContext) {
      const formatterKey = contextValue.slice(1, -1).trim(); // TODO: resolve complex dynamic context
      if (includes(formatterKey, allFormatters)) return context.format(formatterKey, data[dataKey]);
    } else if (contextValue) {
      // (2)
      if (contextValue.includes('determiner_')) {
        const [, determinerType] = contextValue.split('determiner_') as [string, DeterminerType]; // TODO: resolve complex context
        const isPlural = determinerType.includes('plural');

        const value = data[dataKey]?.[isPlural ? 'other' : 'one'] || data[dataKey]?.value || data[dataKey];
        if (!context.determiners) return value;

        const valueDeterminer = data[dataKey]?.determinerType || Object.keys(context.determiners)[0];
        return `${context.determiners[valueDeterminer]?.[determinerType] ?? ''}${value}`;
      } else if (includes(contextValue, allFormatters)) {
        return context.format(contextValue, data[dataKey]);
      }
    }

    return data[dataKey]; // (1)
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TOptions = { [key: string]: any } & {
  count?: number | 'other';
  determinerType?: DeterminerType;
};
export type TranslateContext = {
  dicts: IntlDictsCache;
  format: Format;
  determiners: Determiners;
};

export function translate(dict: IntlDict, key: string, data: TOptions, context: TranslateContext): string;
export function translate(
  dict: IntlDict,
  key: string,
  data: TOptions,
  context: TranslateContext,
  returnRaw: false,
): string;
export function translate(
  dict: IntlDict,
  key: string,
  data: TOptions,
  context: TranslateContext,
  returnRaw: true,
): Record<string, unknown>;

export function translate(
  dict: IntlDict,
  key: string,
  data: TOptions,
  context: TranslateContext,
  returnRaw?: boolean,
): string | Record<string, unknown> {
  let value: unknown = dict;
  for (const part of key.split('.')) {
    if (isNonNullObject(value)) value = value[part];
    else return key;
  }

  if (typeof value === 'string') return interpolate(value, data, { ...context, currentDict: dict }) ?? key;

  if (isNonNullObject(value)) {
    if (returnRaw) return value;

    const cardinal = typeof data.count === 'number' ? context.format('cardinal', data.count ?? 1) : 'other';
    const subValue = value[cardinal] || value.other || value.one || value.value;
    const result = interpolate(subValue as string, data, { ...context, currentDict: dict });
    if (!result) return key;
    if (!data.determinerType || !context.determiners) return result;

    const determinerKey =
      typeof value.determinerType === 'string' ? value.determinerType : Object.keys(context.determiners)[0];
    const determiner = context.determiners[determinerKey]?.[data.determinerType];
    return determiner ? `${determiner}${result}` : result;
  }

  return key;
}
