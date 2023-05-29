import { useEffect } from 'react';
import type { DependencyList, EffectCallback } from 'react';

export const useLazyEffect = (effect: EffectCallback, deps: DependencyList = [], delay = 500) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};
