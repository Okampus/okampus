'use server';

import type { NextFormMessages, NextServerAction, WrappedActionContext } from '../../types';

type OptimisticContext<T> = {
  setOptimistic: (data: T) => void;
};
export function withOptimistic<T extends Record<string, unknown>>(
  wrappedAction: (context: WrappedActionContext<T>, optimistic: OptimisticContext<T>) => Promise<NextFormMessages<T>>,
): (context: OptimisticContext<T>) => NextServerAction<T> {
  return ({ setOptimistic }: OptimisticContext<T>) =>
    async (previousState, formData: FormData) => {
      const optimisticState = await wrappedAction({ previousState, formData }, { setOptimistic });
      return optimisticState;
    };
}
